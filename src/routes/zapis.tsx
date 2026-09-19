import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/site/Section";
import { supabase } from "@/integrations/supabase/client";
import {
  useServices,
  useSettings,
  formatPrice,
  DEFAULT_TIME_SLOTS,
  telHref,
} from "@/lib/api";

export const Route = createFileRoute("/zapis")({
  validateSearch: (search: Record<string, unknown>) => ({
    service: typeof search['service'] === "string" ? (search['service'] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Запись — А&Астудия" },
      {
        name: "description",
        content: "Онлайн-запись в студию волос А&Астудия: выберите услугу, дату и удобное время.",
      },
      { property: "og:title", content: "Запись — А&Астудия" },
      { property: "og:description", content: "Онлайн-запись в студию волос А&Астудия в Коломне." },
    ],
  }),
  component: BookingPage,
});

function todayISO() {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

function BookingPage() {
  const { service: preselected } = Route.useSearch();
  const { data: services } = useServices();
  const { data: settings } = useSettings();

  const slots = useMemo(() => {
    const raw = settings?.["time_slots"];
    const list = (raw ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return list.length ? list : DEFAULT_TIME_SLOTS;
  }, [settings]);

  const [serviceId, setServiceId] = useState<string>(preselected ?? "");
  const [date, setDate] = useState(todayISO());
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState<null | { date: string; time: string; service: string }>(null);

  const selected = (services ?? []).find((s) => s.id === serviceId) ?? null;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!time) return toast.error("Выберите время");
    if (!name.trim()) return toast.error("Укажите имя");
    if (!phone.trim()) return toast.error("Укажите телефон");
    setSaving(true);
    const { error } = await supabase.from("bookings").insert({
      service_id: selected?.id ?? null,
      service_name: selected?.name ?? null,
      booking_date: date,
      booking_time: time,
      client_name: name.trim(),
      client_phone: phone.trim(),
      comment: comment.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Не удалось отправить заявку. Попробуйте ещё раз.");
      return;
    }
    // Точка интеграции: отсюда можно отправлять уведомления в WhatsApp / Telegram /
    // на e-mail и создавать событие в Google Calendar, когда сервисы будут подключены.
    setDone({ date, time, service: selected?.name ?? "Консультация" });
    toast.success("Заявка отправлена");
  }

  if (done) {
    const phoneNumber = settings?.["phone"] ?? "";
    return (
      <Section eyebrow="Запись" title="Заявка принята">
        <div className="soft-card max-w-xl p-6">
          <p className="text-sm text-muted-foreground">
            Спасибо! Мы свяжемся с вами для подтверждения записи.
          </p>
          <dl className="mt-5 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Услуга</dt>
              <dd>{done.service}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Дата</dt>
              <dd>{new Date(done.date).toLocaleDateString("ru-RU")}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Время</dt>
              <dd>{done.time}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link to="/">На главную</Link>
            </Button>
            {phoneNumber ? (
              <Button asChild variant="secondary">
                <a href={telHref(phoneNumber)}>Позвонить в студию</a>
              </Button>
            ) : null}
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section
      eyebrow="Запись"
      title="Онлайн-запись"
      description="Выберите услугу, дату и удобное время — мы свяжемся с вами для подтверждения."
    >
      <form onSubmit={submit} className="soft-card max-w-xl space-y-6 p-5 sm:p-6">
        <div className="space-y-2">
          <Label>Услуга</Label>
          <div className="grid gap-2">
            {(services ?? []).map((s) => (
              <button
                type="button"
                key={s.id}
                onClick={() => setServiceId(s.id)}
                className={
                  "flex items-center justify-between rounded-lg border px-4 py-3 text-left text-sm transition-colors " +
                  (serviceId === s.id ? "border-foreground bg-secondary" : "border-border")
                }
              >
                <span>{s.name}</span>
                <span className="text-muted-foreground">{formatPrice(s.price)}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => setServiceId("")}
              className={
                "rounded-lg border px-4 py-3 text-left text-sm transition-colors " +
                (serviceId === "" ? "border-foreground bg-secondary" : "border-border")
              }
            >
              Не знаю — нужна консультация
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date">Дата</Label>
          <Input
            id="date"
            type="date"
            min={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Время</Label>
          <div className="flex flex-wrap gap-2">
            {slots.map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setTime(t)}
                className={
                  "rounded-full border px-4 py-2.5 text-sm transition-colors " +
                  (time === t ? "border-foreground bg-primary text-primary-foreground" : "border-border")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            placeholder="+7 ..."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="h-12"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий (необязательно)</Label>
          <Textarea id="comment" value={comment} onChange={(e) => setComment(e.target.value)} rows={3} />
        </div>

        <Button type="submit" className="h-12 w-full" disabled={saving}>
          {saving ? "Отправляем..." : "Записаться"}
        </Button>
      </form>
    </Section>
  );
}
