import { createFileRoute } from "@tanstack/react-router";
import { Section, EmptyState } from "@/components/site/Section";
import { useArticles } from "@/lib/api";

export const Route = createFileRoute("/uhod")({
  head: () => ({
    meta: [
      { title: "Уход за волосами — А&Астудия" },
      {
        name: "description",
        content: "Секрет долго сохраняющейся красоты: советы по уходу за цветом, блондом, блеском и домашним уходом.",
      },
      { property: "og:title", content: "Секрет долго сохраняющейся красоты" },
      { property: "og:description", content: "Статьи и советы по уходу за волосами от А&Астудии." },
    ],
  }),
  component: CarePage,
});

function CarePage() {
  const { data: articles } = useArticles();

  return (
    <Section eyebrow="Уход" title="Секрет долго сохраняющейся красоты">
      {articles?.length ? (
        <div className="grid gap-6">
          {articles.map((a) => (
            <article key={a.id} className="soft-card overflow-hidden">
              {a.cover_url ? (
                <img src={a.cover_url} alt="" className="h-52 w-full object-cover" />
              ) : null}
              <div className="p-6">
                <h3 className="text-2xl">{a.title}</h3>
                {a.excerpt ? <p className="mt-2 text-sm text-muted-foreground">{a.excerpt}</p> : null}
                {a.body ? (
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed">{a.body}</p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState text="Статьи пока не опубликованы." />
      )}
    </Section>
  );
}
