import { Link } from "@tanstack/react-router";
import { useSettings, telHref, waHref, tgHref } from "@/lib/api";
import { NAV } from "./Header";

export function Footer() {
  const { data: settings } = useSettings();
  const phone = settings?.["phone"] ?? "";
  const wa = waHref(settings?.["whatsapp"] ?? "");
  const tg = tgHref(settings?.["telegram"] ?? "");

  return (
    <footer className="mt-24 border-t border-border bg-secondary/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2">
        <div>
          <p className="display-title text-3xl">{settings?.["studio_name"] ?? "А&Астудия"}</p>
          <p className="mt-3 text-sm text-muted-foreground">{settings?.["address"]}</p>
          {phone ? (
            <a href={telHref(phone)} className="mt-2 block text-sm underline underline-offset-4">
              {phone}
            </a>
          ) : null}
          {settings?.["working_hours"] ? (
            <p className="mt-2 text-sm text-muted-foreground">{settings["working_hours"]}</p>
          ) : null}
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
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
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {NAV.map((item) => (
            <Link key={item.to} to={item.to} className="text-muted-foreground hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="border-t border-border/70 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} {settings?.["studio_name"] ?? "А&Астудия"}
      </div>
    </footer>
  );
}
