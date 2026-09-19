import { useRef, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import { useSettings } from "@/lib/api";

export const DESIGNS = [
  { id: "powder", label: "Пудровый", bg: "#F4D0D0", fg: "#2F2B2A" },
  { id: "milk", label: "Молочный", bg: "#F7F3EE", fg: "#2F2B2A" },
  { id: "taupe", label: "Тауп", bg: "#B7A99A", fg: "#FFFDFA" },
  { id: "graphite", label: "Графит", bg: "#3A3836", fg: "#F4D0D0" },
] as const;

export const Route = createFileRoute("/sertifikat")({
  head: () => ({
    meta: [
      { title: "Подарочный сертификат — А&Астудия" },
      {
        name: "description",
        content: "Подарите красоту: электронный подарочный сертификат студии волос А&Астудия.",
      },
      { property: "og:title", content: "Подарочный сертификат — А&Астудия" },
      { property: "og:description", content: "Подарочный сертификат студии волос А&Астудия." },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const { data: settings } = useSettings();
  const studio = settings?.["studio_name"] ?? "А&Астудия";
  const [amount, setAmount] = useState("5000");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("");
  const [message, setMessage] = useState("");
  const [design, setDesign] = useState<string>("powder");
  const [saving, setSaving] = useState(false);
  const [code, setCode] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const theme = DESIGNS.find((d) => d.id === design) ?? DESIGNS[0];

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = Number(amount);
    if (!value || value <= 0) return toast.error("Укажите сумму");
    if (!recipient.trim() || !sender.trim()) return toast.error("Укажите имена получателя и отправителя");
    setSaving(true);
    const { data, error } = await supabase
      .from("gift_certificates")
      .insert({
        amount: value,
        recipient_name: recipient.trim(),
        sender_name: sender.trim(),
        message: message.trim() || null,
        design,
      })
      .select("code")
      .single();
    setSaving(false);
    if (error || !data) {
      toast.error("Не удалось оформить сертификат. Попробуйте ещё раз.");
      return;
    }
    // Точка интеграции: здесь можно подключить онлайн-оплату сертификата.
    setCode(data.code);
    toast.success("Сертификат оформлен");
  }

  function download() {
    const node = cardRef.current;
    if (!node) return;
    const width = 1000;
    const height = 600;
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = theme.fg;
    ctx.globalAlpha = 0.3;
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 30, width - 60, height - 60);
    ctx.globalAlpha = 1;
    ctx.fillStyle = theme.fg;
    ctx.textAlign = "center";
    ctx.font = "300 30px Georgia, serif";
    ctx.fillText(studio, width / 2, 120);
    ctx.font = "300 22px Georgia, serif";
    ctx.fillText("ПОДАРОЧНЫЙ СЕРТИФИКАТ", width / 2, 175);
    ctx.font = "400 72px Georgia, serif";
    ctx.fillText(`${new Intl.NumberFormat("ru-RU").format(Number(amount))} ₽`, width / 2, 280);
    ctx.font = "300 24px Georgia, serif";
    ctx.fillText(`Для: ${recipient}`, width / 2, 340);
    ctx.fillText(`От: ${sender}`, width / 2, 380);
    if (message) {
      ctx.font = "italic 300 22px Georgia, serif";
      ctx.fillText(message.slice(0, 70), width / 2, 435);
    }
    if (code) {
      ctx.font = "300 20px Georgia, serif";
      ctx.fillText(`Код: ${code}`, width / 2, 520);
    }
    const link = document.createElement("a");
    link.download = `sertifikat-${code ?? "preview"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  return (
    <Section
      eyebrow="Подарите красоту"
      title="Подарочный сертификат"
      description="Оформите сертификат, выберите оформление и скачайте изображение, чтобы подарить его."
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <form onSubmit={submit} className="soft-card space-y-5 p-5 sm:p-6">
          <div className="space-y-2">
            <Label htmlFor="amount">Сумма, ₽</Label>
            <Input
              id="amount"
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-12"
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {["3000", "5000", "10000"].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setAmount(v)}
                  className="rounded-full border border-border px-4 py-2 text-sm"
                >
                  {new Intl.NumberFormat("ru-RU").format(Number(v))} ₽
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Кому</Label>
            <Input id="recipient" value={recipient} onChange={(e) => setRecipient(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sender">От кого</Label>
            <Input id="sender" value={sender} onChange={(e) => setSender(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="msg">Пожелание (необязательно)</Label>
            <Textarea id="msg" value={message} onChange={(e) => setMessage(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Оформление</Label>
            <div className="flex flex-wrap gap-2">
              {DESIGNS.map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDesign(d.id)}
                  className={
                    "flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors " +
                    (design === d.id ? "border-foreground" : "border-border")
                  }
                >
                  <span className="size-4 rounded-full" style={{ background: d.bg }} />
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <Button type="submit" className="h-12 w-full" disabled={saving}>
            {saving ? "Оформляем..." : "Оформить сертификат"}
          </Button>
          <p className="text-xs text-muted-foreground">
            Онлайн-оплата пока не подключена — после оформления студия свяжется с вами.
          </p>
        </form>

        <div className="space-y-4">
          <div
            ref={cardRef}
            className="rounded-2xl p-8 text-center shadow-sm"
            style={{ background: theme.bg, color: theme.fg }}
          >
            <p className="display-title text-2xl">{studio}</p>
            <p className="eyebrow mt-3" style={{ color: theme.fg }}>
              Подарочный сертификат
            </p>
            <p className="display-title mt-6 text-5xl">
              {new Intl.NumberFormat("ru-RU").format(Number(amount) || 0)} ₽
            </p>
            <p className="mt-6 text-sm">Для: {recipient || "—"}</p>
            <p className="text-sm">От: {sender || "—"}</p>
            {message ? <p className="mt-4 text-sm italic">«{message}»</p> : null}
            {code ? <p className="mt-6 text-xs tracking-widest">КОД: {code}</p> : null}
          </div>
          <Button variant="outline" className="h-12 w-full" onClick={download}>
            Скачать изображение сертификата
          </Button>
        </div>
      </div>
    </Section>
  );
}
