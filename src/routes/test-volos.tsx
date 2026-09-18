import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Section, EmptyState } from "@/components/site/Section";
import { useQuiz, useRules, useServices, pickRecommendation, formatPrice } from "@/lib/api";

export const Route = createFileRoute("/test-volos")({
  head: () => ({
    meta: [
      { title: "Тест волос — А&Астудия" },
      {
        name: "description",
        content: "Пять вопросов о ваших волосах — и персональная рекомендация по уходу и цвету от А&Астудии.",
      },
      { property: "og:title", content: "Тест волос — А&Астудия" },
      { property: "og:description", content: "Подберём уход и цвет по вашим ответам." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const { data: quiz, isLoading } = useQuiz();
  const { data: rules } = useRules();
  const { data: services } = useServices();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const questions = quiz?.questions ?? [];
  const current = questions[step];
  const options = (quiz?.options ?? []).filter((o) => o.question_id === current?.id);
  const tags = useMemo(() => Object.values(answers), [answers]);

  const recommendation = done && rules ? pickRecommendation(tags, rules) : null;
  const service = services?.find((s) => s.id === recommendation?.service_id);
  const addon = services?.find((s) => s.id === recommendation?.addon_service_id);

  if (isLoading) return <Section title="Тест волос">Загрузка…</Section>;
  if (!questions.length)
    return (
      <Section eyebrow="Тест волос" title="Тест волос">
        <EmptyState text="Вопросы теста пока не настроены." />
      </Section>
    );

  if (done) {
    return (
      <Section eyebrow="Результат" title="Ваша персональная рекомендация">
        <div className="soft-card max-w-2xl p-6">
          <h3 className="text-2xl">{recommendation?.title ?? "Консультация мастера"}</h3>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {recommendation?.explanation}
          </p>
          {service ? (
            <div className="mt-5 rounded-lg bg-secondary/60 p-4">
              <p className="eyebrow">Рекомендуемая услуга</p>
              <p className="mt-1 text-lg">{service.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(service.price)}</p>
            </div>
          ) : null}
          {addon ? (
            <div className="mt-3 rounded-lg border border-border p-4">
              <p className="eyebrow">Можно дополнить</p>
              <p className="mt-1 text-lg">{addon.name}</p>
              <p className="text-sm text-muted-foreground">{formatPrice(addon.price)}</p>
            </div>
          ) : null}
          <p className="mt-5 text-xs text-muted-foreground">
            Тест носит рекомендательный характер и не является медицинской консультацией.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-11">
              <Link to="/zapis" search={service ? { service: service.id } : {}}>
                Записаться
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-11">
              <Link to="/uslugi">Посмотреть услуги</Link>
            </Button>
            <Button
              variant="ghost"
              className="h-11"
              onClick={() => {
                setDone(false);
                setStep(0);
                setAnswers({});
              }}
            >
              Пройти заново
            </Button>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section eyebrow={`Шаг ${step + 1} из ${questions.length}`} title={current?.text ?? ""}>
      <div className="mb-6 h-1 w-full max-w-2xl rounded bg-muted">
        <div
          className="h-1 rounded bg-accent transition-all"
          style={{ width: `${((step + 1) / questions.length) * 100}%` }}
        />
      </div>
      <div className="grid max-w-2xl gap-3">
        {options.map((o) => {
          const selected = answers[current!.id] === o.tag;
          return (
            <button
              key={o.id}
              onClick={() => setAnswers((a) => ({ ...a, [current!.id]: o.tag }))}
              className={
                "rounded-xl border px-5 py-4 text-left text-base transition-colors " +
                (selected ? "border-foreground bg-secondary" : "border-border hover:bg-secondary/50")
              }
            >
              {o.label}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex max-w-2xl gap-3">
        <Button variant="outline" className="h-11" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
          Назад
        </Button>
        <Button
          className="h-11 flex-1"
          disabled={!answers[current!.id]}
          onClick={() => (step + 1 < questions.length ? setStep((s) => s + 1) : setDone(true))}
        >
          {step + 1 < questions.length ? "Далее" : "Показать рекомендацию"}
        </Button>
      </div>
    </Section>
  );
}
