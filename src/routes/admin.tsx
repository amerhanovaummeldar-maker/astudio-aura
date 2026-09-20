import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser, useIsAdmin } from "@/lib/useAdmin";
import { ServicesAdmin } from "@/components/admin/ServicesAdmin";
import { PortfolioAdmin } from "@/components/admin/PortfolioAdmin";
import { ReviewsAdmin, ArticlesAdmin, BookingsAdmin, CertificatesAdmin } from "@/components/admin/ContentAdmin";
import { QuizAdmin, RulesAdmin } from "@/components/admin/QuizAdmin";
import { SettingsAdmin } from "@/components/admin/SettingsAdmin";
import { useBookings, useCertificates, usePortfolio, useServices } from "@/lib/api";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Панель управления — А&Астудия" },
      { name: "description", content: "Панель управления студии А&Астудия." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Панель управления — А&Астудия" },
      { property: "og:description", content: "Панель управления студии." },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  "Главная",
  "Услуги",
  "Портфолио",
  "Видео",
  "Фотографии",
  "Тест волос",
  "Рекомендации",
  "Отзывы",
  "Уход",
  "Подарочные сертификаты",
  "Записи",
  "Настройки",
] as const;

type Tab = (typeof TABS)[number];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, loading } = useAuthUser();
  const isAdmin = useIsAdmin(user?.id);
  const [tab, setTab] = useState<Tab>("Главная");

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/vhod", replace: true });
  }, [loading, user, navigate]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/vhod", replace: true });
  }

  if (loading || !user) {
    return <div className="p-8 text-center text-sm text-muted-foreground">Загрузка...</div>;
  }

  if (isAdmin === false) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="display-title text-2xl">Нет доступа</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Этот аккаунт не является администратором студии.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={signOut}>
            Выйти
          </Button>
          <Button asChild variant="secondary">
            <Link to="/">На сайт</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <span className="display-title text-lg">Панель управления</span>
          <div className="flex gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">На сайт</Link>
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              Выйти
            </Button>
          </div>
        </div>
        <div className="-mx-0 overflow-x-auto border-t border-border">
          <div className="mx-auto flex max-w-5xl gap-2 px-4 py-2">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={
                  "shrink-0 rounded-full border px-4 py-2 text-sm transition-colors " +
                  (tab === t ? "border-foreground bg-primary text-primary-foreground" : "border-border")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 pb-24">
        {tab === "Главная" ? <Overview onOpen={setTab} /> : null}
        {tab === "Услуги" ? <ServicesAdmin /> : null}
        {tab === "Портфолио" || tab === "Фотографии" ? <PortfolioAdmin mediaType="photo" /> : null}
        {tab === "Видео" ? <PortfolioAdmin mediaType="video" /> : null}
        {tab === "Тест волос" ? <QuizAdmin /> : null}
        {tab === "Рекомендации" ? <RulesAdmin /> : null}
        {tab === "Отзывы" ? <ReviewsAdmin /> : null}
        {tab === "Уход" ? <ArticlesAdmin /> : null}
        {tab === "Подарочные сертификаты" ? <CertificatesAdmin /> : null}
        {tab === "Записи" ? <BookingsAdmin /> : null}
        {tab === "Настройки" ? <SettingsAdmin /> : null}
      </main>
    </div>
  );
}

function Overview({ onOpen }: { onOpen: (t: Tab) => void }) {
  const { data: bookings } = useBookings();
  const { data: services } = useServices(true);
  const { data: portfolio } = usePortfolio(true);
  const { data: certificates } = useCertificates();

  const newBookings = (bookings ?? []).filter((b) => b.status === "new").length;

  const cards: { label: string; value: number; tab: Tab }[] = [
    { label: "Новые записи", value: newBookings, tab: "Записи" },
    { label: "Услуги", value: services?.length ?? 0, tab: "Услуги" },
    { label: "Работы в портфолио", value: portfolio?.length ?? 0, tab: "Портфолио" },
    { label: "Сертификаты", value: certificates?.length ?? 0, tab: "Подарочные сертификаты" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="display-title text-2xl">Обзор</h2>
      <div className="grid grid-cols-2 gap-3">
        {cards.map((c) => (
          <button key={c.label} onClick={() => onOpen(c.tab)} className="soft-card p-4 text-left">
            <p className="display-title text-3xl">{c.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{c.label}</p>
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">
        Все разделы доступны сверху. Панель рассчитана на работу с телефона.
      </p>
    </div>
  );
}
