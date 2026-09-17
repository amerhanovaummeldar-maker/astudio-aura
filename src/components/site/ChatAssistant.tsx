import { useMemo, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSettings, useServices, useArticles, formatPrice } from "@/lib/api";

type Msg = { role: "assistant" | "user"; text: string };

/**
 * Помощник отвечает ТОЛЬКО по данным, сохранённым в приложении
 * (услуги, цены, статьи об уходе, настройки студии).
 * Точка интеграции для будущего AI API — функция answer() ниже.
 */
export function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { data: settings } = useSettings();
  const { data: services } = useServices();
  const { data: articles } = useArticles();

  const greeting = settings?.["assistant_greeting"] || "Здравствуйте! Какой образ мы сегодня создаём?";
  const [messages, setMessages] = useState<Msg[]>([]);
  const thread = useMemo<Msg[]>(
    () => [{ role: "assistant", text: greeting }, ...messages],
    [greeting, messages],
  );

  function answer(question: string): string {
    const q = question.toLowerCase();
    const knowledge = settings?.["assistant_knowledge"] ?? "";

    if (/цен|стоим|сколько/.test(q)) {
      const priced = (services ?? []).filter((s) => s.price != null);
      if (!priced.length) return "Цены пока не опубликованы в приложении. Уточните их по телефону студии.";
      return (
        "Актуальные цены из прайса студии:\n" +
        priced.slice(0, 8).map((s) => `• ${s.name} — ${formatPrice(s.price)}`).join("\n")
      );
    }
    if (/услуг|стрижк|окраш|блонд|завивк|уклад|седин/.test(q)) {
      const matched = (services ?? []).filter(
        (s) => q.split(/\s+/).some((w) => w.length > 3 && (s.name.toLowerCase().includes(w) || s.category.toLowerCase().includes(w))),
      );
      const list = (matched.length ? matched : services ?? []).slice(0, 8);
      if (!list.length) return "Список услуг пока не заполнен в приложении.";
      return "Вот что есть в студии:\n" + list.map((s) => `• ${s.name} (${s.category}) — ${formatPrice(s.price)}`).join("\n");
    }
    if (/запис|свобод|время|когда/.test(q)) {
      return "Записаться можно в разделе «Запись»: выберите услугу, дату и удобное время. Заявка сразу попадёт к мастеру.";
    }
    if (/уход|восстанов|блеск|дом/.test(q)) {
      const a = (articles ?? [])[0];
      return a
        ? `Рекомендую статью «${a.title}». ${a.excerpt ?? ""}`.trim()
        : "Статьи об уходе пока не опубликованы.";
    }
    if (/адрес|где|телефон|контакт|связ/.test(q)) {
      return `${settings?.["studio_name"] ?? "А&Астудия"}\n${settings?.["address"] ?? ""}\n${settings?.["phone"] ?? ""}`.trim();
    }
    if (/портфолио|работ|фото|видео/.test(q)) {
      return "Работы мастера — в разделе «Портфолио»: фото и короткие видео по категориям.";
    }
    if (knowledge) return knowledge;
    return "Я отвечаю по информации студии: услуги, цены, уход, запись, контакты. Задайте вопрос по одной из этих тем — или позвоните нам.";
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "assistant", text: answer(text) }]);
    setInput("");
  }

  return (
    <>
      {open ? (
        <div className="fixed inset-x-3 bottom-3 z-50 flex max-h-[75vh] flex-col overflow-hidden soft-card sm:inset-x-auto sm:right-6 sm:w-96">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="display-title text-lg">Онлайн-помощник</span>
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Закрыть">
              <X className="size-4" />
            </Button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {thread.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto w-fit max-w-[85%] whitespace-pre-line rounded-xl bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "w-fit max-w-[90%] whitespace-pre-line text-sm text-foreground"
                }
              >
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ваш вопрос…"
              className="h-11"
            />
            <Button size="icon" className="size-11 shrink-0" onClick={send} aria-label="Отправить">
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 size-14 rounded-full shadow-lg"
          aria-label="Открыть чат"
        >
          <MessageCircle className="size-6" />
        </Button>
      )}
    </>
  );
}
