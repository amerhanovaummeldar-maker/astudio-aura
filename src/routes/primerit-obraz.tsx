import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { Textarea } from "@/components/ui/textarea";

const LOOKS = ["Примерить стрижку", "Попробовать новый цвет", "Попробовать завивку"] as const;

export const Route = createFileRoute("/primerit-obraz")({
  head: () => ({
    meta: [
      { title: "Примерить образ — А&Астудия" },
      {
        name: "description",
        content: "Загрузите своё фото и отправьте пожелание по стрижке, цвету или завивке мастеру А&Астудии.",
      },
      { property: "og:title", content: "Примерить образ — А&Астудия" },
      { property: "og:description", content: "Виртуальная примерочная образа." },
    ],
  }),
  component: MirrorPage,
});

function MirrorPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [look, setLook] = useState<string>(LOOKS[0]);
  const [wish, setWish] = useState("");

  return (
    <Section
      eyebrow="Виртуальное зеркало"
      title="Примерьте новый образ"
      description="Загрузите фото с телефона и выберите желаемое преображение. Автоматическая AI-обработка фото пока не подключена — ваше фото и пожелание можно отправить мастеру, чтобы обсудить образ на консультации."
    >
      <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
        <div>
          <label className="soft-card flex aspect-[3/4] cursor-pointer items-center justify-center overflow-hidden text-center text-sm text-muted-foreground">
            {preview ? (
              <img src={preview} alt="Ваше фото" className="size-full object-cover" />
            ) : (
              <span className="px-6">Нажмите, чтобы загрузить фото с телефона</span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </label>
          {preview ? (
            <Button variant="ghost" className="mt-2 w-full" onClick={() => setPreview(null)}>
              Убрать фото
            </Button>
          ) : null}
        </div>

        <div>
          <p className="eyebrow">Что примеряем</p>
          <div className="mt-3 grid gap-2">
            {LOOKS.map((l) => (
              <button
                key={l}
                onClick={() => setLook(l)}
                className={
                  "rounded-xl border px-4 py-3.5 text-left text-sm " +
                  (look === l ? "border-foreground bg-secondary" : "border-border")
                }
              >
                {l}
              </button>
            ))}
          </div>
          <Textarea
            className="mt-4 min-h-24"
            placeholder="Опишите желаемый результат (необязательно)"
            value={wish}
            onChange={(e) => setWish(e.target.value)}
          />
          <div className="mt-4 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
            {preview
              ? `Готово к обсуждению: ${look}${wish ? ` — ${wish}` : ""}. Покажите это фото мастеру при записи.`
              : "Сначала загрузите фото."}
          </div>
          <Button asChild className="mt-4 h-11 w-full" disabled={!preview}>
            <Link to="/zapis">Записаться на консультацию</Link>
          </Button>
        </div>
      </div>
    </Section>
  );
}
