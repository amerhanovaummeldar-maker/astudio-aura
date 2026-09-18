import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/site/Section";
import { useSettings, telHref, waHref, tgHref } from "@/lib/api";

export const Route = createFileRoute("/kontakty")({
  head: () => ({
    meta: [
      { title: "Контакты — А&Астудия" },
      { name: "description", content: "А&Астудия, МО, г. Коломна. Телефон 8-916-364-94-74." },
      { property: "og:title", content: "Контакты — А&Астудия" },
      { property: "og:description", content: "Как связаться со студией и записаться." },
    ],
  }),
  component: ContactsPage,
});

function ContactsPage() {
  const { data: settings } = useSettings();
  const phone = settings?.["phone"] ?? "";
  const wa = waHref(settings?.["whatsapp"] ?? "");
  const tg = tgHref(settings?.["telegram"] ?? "");

  return (
    <Section eyebrow="Контакты" title={settings?.["studio_name"] ?? "А&Астудия"}>
      <div className="max-w-xl space-y-4">
        <p className="text-base">{settings?.["address"]}</p>
        {phone ? (
          <a href={telHref(phone)} className="block text-2xl underline underline-offset-8">
            {phone}
          </a>
        ) : null}
        {settings?.["working_hours"] ? (
          <p className="text-sm text-muted-foreground">{settings["working_hours"]}</p>
        ) : null}

        <div className="grid gap-3 pt-4 sm:grid-cols-3">
          {phone ? (
            <Button asChild className="h-12">
              <a href={telHref(phone)}>Позвонить</a>
            </Button>
          ) : null}
          {wa ? (
            <Button asChild variant="outline" className="h-12">
              <a href={wa} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            </Button>
          ) : null}
          {tg ? (
            <Button asChild variant="outline" className="h-12">
              <a href={tg} target="_blank" rel="noreferrer">
                Telegram
              </a>
            </Button>
          ) : null}
        </div>

        <div className="flex flex-wrap gap-4 pt-2 text-sm">
          {settings?.["instagram"] ? (
            <a href={settings["instagram"]} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              Instagram
            </a>
          ) : null}
          {settings?.["vk"] ? (
            <a href={settings["vk"]} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              ВКонтакте
            </a>
          ) : null}
        </div>
      </div>
    </Section>
  );
}
