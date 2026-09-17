import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useSettings, telHref, waHref, tgHref } from "@/lib/api";

export const NAV = [
  { to: "/", label: "Главная" },
  { to: "/uslugi", label: "Услуги" },
  { to: "/portfolio", label: "Портфолио" },
  { to: "/test-volos", label: "Тест волос" },
  { to: "/primerit-obraz", label: "Примерить образ" },
  { to: "/uhod", label: "Уход" },
  { to: "/sertifikat", label: "Подарочный сертификат" },
  { to: "/zapis", label: "Запись" },
  { to: "/kontakty", label: "Контакты" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: settings } = useSettings();
  const phone = settings?.["phone"] ?? "";
  const name = settings?.["studio_name"] ?? "А&Астудия";
  const wa = waHref(settings?.["whatsapp"] ?? "");
  const tg = tgHref(settings?.["telegram"] ?? "");

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link to="/" className="display-title text-xl tracking-wide sm:text-2xl">
          {name}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.slice(1, 6).map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              activeProps={{ className: "text-sm text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {phone ? (
            <Button asChild variant="ghost" size="icon" aria-label="Позвонить">
              <a href={telHref(phone)}>
                <Phone className="size-4" />
              </a>
            </Button>
          ) : null}
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link to="/zapis">Записаться</Link>
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Меню" className="lg:hidden">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[86vw] max-w-sm bg-background p-0">
              <SheetTitle className="sr-only">Меню</SheetTitle>
              <div className="flex h-full flex-col">
                <div className="border-b border-border px-6 py-5 display-title text-2xl">{name}</div>
                <nav className="flex-1 overflow-y-auto px-2 py-3">
                  {NAV.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-4 py-3.5 text-base text-foreground/85 transition-colors hover:bg-secondary"
                      activeProps={{ className: "bg-secondary text-foreground" }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
                <div className="space-y-2 border-t border-border p-4">
                  <Button asChild className="h-12 w-full">
                    <Link to="/zapis" onClick={() => setOpen(false)}>
                      Записаться
                    </Link>
                  </Button>
                  {phone ? (
                    <Button asChild variant="outline" className="h-12 w-full">
                      <a href={telHref(phone)}>Позвонить {phone}</a>
                    </Button>
                  ) : null}
                  <div className="grid grid-cols-2 gap-2">
                    {wa ? (
                      <Button asChild variant="secondary" className="h-11">
                        <a href={wa} target="_blank" rel="noreferrer">
                          WhatsApp
                        </a>
                      </Button>
                    ) : null}
                    {tg ? (
                      <Button asChild variant="secondary" className="h-11">
                        <a href={tg} target="_blank" rel="noreferrer">
                          Telegram
                        </a>
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
