import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, EmptyState } from "@/components/site/Section";
import {
  useSettings,
  useServices,
  usePortfolio,
  useReviews,
  telHref,
  waHref,
  tgHref,
  formatPrice,
} from "@/lib/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "А&Астудия — ваш идеальный образ начинается здесь" },
      {
        name: "description",
        content:
          "Студия волос А&Астудия в Коломне: персональный уход, цвет и стиль. Онлайн-запись, тест волос, портфолио работ.",
      },
      { property: "og:title", content: "А&Астудия — студия волос в Коломне" },
      {
        property: "og:description",
        content: "Персональный уход, цвет и стиль, подобранные именно для вас.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { data: settings } = useSettings();
  const { data: services } = useServices();
  const { data: portfolio } = usePortfolio();
  const { data: reviews } = useReviews();

  const phone = settings?.["phone"] ?? "";
  const wa = waHref(settings?.["whatsapp"] ?? "");
  const tg = tgHref(settings?.["telegram"] ?? "");
  const hero = settings?.["hero_image_url"] ?? "";

  return (
    <div>
      <section className="relative overflow-hidden bg-secondary/50">
        {hero ? (
          <img src={hero} alt="" className="absolute inset-0 size-full object-cover opacity-45" />
        ) : null}
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <p className="eyebrow fade-up">{settings?.["address"] ?? "МО, г. Коломна"}</p>
          <h1 className="display-title fade-up mt-5 max-w-3xl text-4xl sm:text-6xl">
            {settings?.["hero_title"] ?? "Ваш идеальный образ начинается здесь"}
          </h1>
          <p className="fade-up mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            {settings?.["hero_subtitle"] ??
              "Персональный уход, цвет и стиль, подобранные именно для вас."}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12">
              <Link to="/zapis">Записаться</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12">
              <Link to="/test-volos">Пройти тест волос</Link>
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            {phone ? (
              <a href={telHref(phone)} className="underline underline-offset-4">
                Позвонить
              </a>
            ) : null}
            {wa ? (
              <a href={wa} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                WhatsApp
              </a>
            ) : null}
            {tg ? (
              <a href={tg} target="_blank" rel="noreferrer" className="underline underline-offset-4">
                Telegram
              </a>
            ) : null}
          </div>
        </div>
      </section>

      <Section eyebrow="Услуги" title="Что мы делаем" description={settings?.["about_text"] || undefined}>
        {services?.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((s) => (
              <div key={s.id} className="soft-card p-5">
                <p className="eyebrow">{s.category}</p>
                <h3 className="mt-2 text-xl">{s.name}</h3>
                {s.description ? (
                  <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
                ) : null}
                <p className="mt-4 text-sm">{formatPrice(s.price)}</p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="Услуги пока не добавлены. Их можно добавить в панели администратора." />
        )}
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/uslugi">Все услуги</Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow="Портфолио" title="Работы студии">
        {portfolio?.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {portfolio.slice(0, 6).map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl bg-muted">
                {item.media_type === "video" ? (
                  <video
                    src={item.media_url}
                    poster={item.poster_url ?? undefined}
                    className="aspect-[9/16] w-full object-cover"
                    muted
                    playsInline
                    controls
                  />
                ) : (
                  <img src={item.media_url} alt={item.description ?? ""} className="aspect-[3/4] w-full object-cover" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="Работы пока не загружены." />
        )}
        <div className="mt-6">
          <Button asChild variant="outline">
            <Link to="/portfolio">Смотреть портфолио</Link>
          </Button>
        </div>
      </Section>

      <Section eyebrow="Отзывы" title="Что говорят клиенты">
        {reviews?.length ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {reviews.slice(0, 4).map((r) => (
              <div key={r.id} className="soft-card p-5">
                <p className="text-sm leading-relaxed">{r.text}</p>
                <p className="mt-4 text-sm text-muted-foreground">
                  {r.client_name} · {new Date(r.review_date).toLocaleDateString("ru-RU")}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState text="Отзывы появятся здесь после публикации." />
        )}
      </Section>
    </div>
  );
}
