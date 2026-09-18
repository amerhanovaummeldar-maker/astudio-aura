import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, EmptyState } from "@/components/site/Section";
import { useServices, formatPrice, SERVICE_CATEGORIES } from "@/lib/api";

export const Route = createFileRoute("/uslugi")({
  head: () => ({
    meta: [
      { title: "Услуги — А&Астудия" },
      {
        name: "description",
        content: "Стрижки, окрашивание, блонд, работа с сединой, уходы, завивка и укладка в А&Астудии.",
      },
      { property: "og:title", content: "Услуги — А&Астудия" },
      { property: "og:description", content: "Услуги студии волос А&Астудия в Коломне." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { data: services } = useServices();
  const [category, setCategory] = useState<string>("Все");
  const list = (services ?? []).filter((s) => category === "Все" || s.category === category);

  return (
    <Section eyebrow="Услуги" title="Услуги студии">
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1">
        {["Все", ...SERVICE_CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors " +
              (category === c ? "border-foreground bg-primary text-primary-foreground" : "border-border")
            }
          >
            {c}
          </button>
        ))}
      </div>

      {list.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((s) => (
            <div key={s.id} className="soft-card flex flex-col p-5">
              <p className="eyebrow">{s.category}</p>
              <h3 className="mt-2 text-xl">{s.name}</h3>
              {s.description ? <p className="mt-2 text-sm text-muted-foreground">{s.description}</p> : null}
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-sm">
                  <span>{formatPrice(s.price)}</span>
                  {s.duration_minutes ? (
                    <span className="text-muted-foreground"> · {s.duration_minutes} мин</span>
                  ) : null}
                </div>
                <Button asChild size="sm">
                  <Link to="/zapis" search={{ service: s.id }}>
                    Записаться
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState text="В этой категории пока нет услуг." />
      )}
    </Section>
  );
}
