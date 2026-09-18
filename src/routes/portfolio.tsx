import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Section, EmptyState } from "@/components/site/Section";
import { usePortfolio, PORTFOLIO_CATEGORIES } from "@/lib/api";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Портфолио — А&Астудия" },
      {
        name: "description",
        content: "Фото и видео работ студии: окрашивание, блонд, седина, стрижки, уход, завивка, до и после.",
      },
      { property: "og:title", content: "Портфолио — А&Астудия" },
      { property: "og:description", content: "Работы мастеров А&Астудии: фото и короткие видео." },
    ],
  }),
  component: PortfolioPage,
});

function PortfolioPage() {
  const { data: items } = usePortfolio();
  const [category, setCategory] = useState("Все");
  const [type, setType] = useState<"all" | "photo" | "video">("all");

  const list = (items ?? []).filter(
    (i) => (category === "Все" || i.category === category) && (type === "all" || i.media_type === type),
  );

  return (
    <Section eyebrow="Портфолио" title="Работы студии">
      <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1">
        {["Все", ...PORTFOLIO_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              "shrink-0 rounded-full border px-4 py-2 text-sm " +
              (category === c ? "border-foreground bg-primary text-primary-foreground" : "border-border")
            }
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mb-6 flex gap-2">
        {(
          [
            ["all", "Всё"],
            ["photo", "Фото"],
            ["video", "Видео"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setType(value)}
            className={
              "rounded-full border px-4 py-2 text-sm " +
              (type === value ? "border-foreground bg-secondary" : "border-border")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {list.map((item) => (
            <figure key={item.id} className="overflow-hidden rounded-xl bg-muted">
              {item.media_type === "video" ? (
                <video
                  src={item.media_url}
                  poster={item.poster_url ?? undefined}
                  className="aspect-[9/16] w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={item.media_url}
                  alt={item.description ?? ""}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
              )}
              {item.description ? (
                <figcaption className="bg-card px-3 py-2 text-xs text-muted-foreground">
                  {item.description}
                </figcaption>
              ) : null}
            </figure>
          ))}
        </div>
      ) : (
        <EmptyState text="Работы пока не опубликованы." />
      )}
    </Section>
  );
}
