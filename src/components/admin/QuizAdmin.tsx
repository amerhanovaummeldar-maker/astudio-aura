import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AdminSection, AreaField, Card, ConfirmDelete, Field, useCrud } from "./common";
import { useQuiz, useRules, useServices } from "@/lib/api";

export function QuizAdmin() {
  const { data: quiz } = useQuiz();
  const questions = useCrud("quiz_questions", "quiz");
  const options = useCrud("quiz_options", "quiz");
  const [text, setText] = useState("");

  return (
    <AdminSection title="Тест волос" description="Вопросы и варианты ответов. Теги связывают ответы с рекомендациями.">
      <Card>
        <Field label="Новый вопрос" value={text} onChange={setText} />
        <Button
          className="h-11 w-full"
          disabled={!text.trim()}
          onClick={async () => {
            const ok = await questions.create({
              text: text.trim(),
              position: (quiz?.questions.length ?? 0) + 1,
              published: true,
            });
            if (ok) setText("");
          }}
        >
          Добавить вопрос
        </Button>
      </Card>

      <div className="space-y-3">
        {(quiz?.questions ?? []).map((q) => {
          const list = (quiz?.options ?? []).filter((o) => o.question_id === q.id);
          return (
            <Card key={q.id}>
              <QuestionEditor text={q.text} onSave={(t) => questions.update(q.id, { text: t })} />
              <div className="space-y-2">
                {list.map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
                    <span className="text-sm">
                      {o.label} <span className="text-muted-foreground">· {o.tag}</span>
                    </span>
                    <Button variant="ghost" className="h-9 text-destructive" onClick={() => options.remove(o.id)}>
                      Удалить
                    </Button>
                  </div>
                ))}
              </div>
              <OptionAdder
                onAdd={(label, tag) =>
                  options.create({ question_id: q.id, label, tag, position: list.length + 1 })
                }
              />
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="secondary"
                  className="h-11"
                  onClick={() => questions.update(q.id, { published: !q.published })}
                >
                  {q.published ? "Скрыть вопрос" : "Показать вопрос"}
                </Button>
                <ConfirmDelete onConfirm={() => questions.remove(q.id)} />
              </div>
            </Card>
          );
        })}
      </div>
    </AdminSection>
  );
}

function QuestionEditor({ text, onSave }: { text: string; onSave: (t: string) => void }) {
  const [t, setT] = useState(text);
  return (
    <div className="space-y-2">
      <Field label="Вопрос" value={t} onChange={setT} />
      <Button variant="outline" className="h-11 w-full" onClick={() => onSave(t.trim())}>
        Сохранить вопрос
      </Button>
    </div>
  );
}

function OptionAdder({ onAdd }: { onAdd: (label: string, tag: string) => void }) {
  const [label, setLabel] = useState("");
  const [tag, setTag] = useState("");
  return (
    <div className="space-y-2 rounded-md border border-dashed border-border p-3">
      <Field label="Вариант ответа" value={label} onChange={setLabel} />
      <Field label="Тег (латиницей, напр. dry)" value={tag} onChange={setTag} />
      <Button
        variant="outline"
        className="h-11 w-full"
        disabled={!label.trim() || !tag.trim()}
        onClick={() => {
          onAdd(label.trim(), tag.trim());
          setLabel("");
          setTag("");
        }}
      >
        Добавить вариант
      </Button>
    </div>
  );
}

export function RulesAdmin() {
  const { data: rules } = useRules();
  const { data: services } = useServices(true);
  const crud = useCrud("recommendation_rules", "rules");
  const [title, setTitle] = useState("");
  const [explanation, setExplanation] = useState("");
  const [tags, setTags] = useState("");

  const serviceName = (id: string | null) =>
    id ? ((services ?? []).find((s) => s.id === id)?.name ?? "—") : "—";

  return (
    <AdminSection
      title="Рекомендации"
      description="Правила подбора: чем больше совпавших тегов, тем выше приоритет правила."
    >
      <Card>
        <Field label="Название рекомендации" value={title} onChange={setTitle} />
        <AreaField label="Пояснение" value={explanation} onChange={setExplanation} rows={3} />
        <Field label="Теги через запятую" value={tags} onChange={setTags} placeholder="dry, dryness" />
        <Button
          className="h-11 w-full"
          disabled={!title.trim() || !explanation.trim()}
          onClick={async () => {
            const ok = await crud.create({
              title: title.trim(),
              explanation: explanation.trim(),
              match_tags: tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean),
              priority: 0,
              is_default: false,
            });
            if (ok) {
              setTitle("");
              setExplanation("");
              setTags("");
            }
          }}
        >
          Добавить правило
        </Button>
      </Card>

      <div className="space-y-3">
        {(rules ?? []).map((r) => (
          <Card key={r.id}>
            <div>
              <p className="text-base">{r.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{r.explanation}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Теги: {r.match_tags.join(", ") || "—"}
                {r.is_default ? " · по умолчанию" : ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Услуга: {serviceName(r.service_id)} · Дополнительно: {serviceName(r.addon_service_id)}
              </p>
            </div>
            <RuleEditor
              rule={r}
              services={(services ?? []).map((s) => ({ id: s.id, name: s.name }))}
              onSave={(values) => crud.update(r.id, values)}
            />
            <ConfirmDelete onConfirm={() => crud.remove(r.id)} />
          </Card>
        ))}
      </div>
    </AdminSection>
  );
}

function RuleEditor({
  rule,
  services,
  onSave,
}: {
  rule: { title: string; explanation: string; match_tags: string[]; service_id: string | null; addon_service_id: string | null; priority: number };
  services: { id: string; name: string }[];
  onSave: (values: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState(rule.title);
  const [explanation, setExplanation] = useState(rule.explanation);
  const [tags, setTags] = useState(rule.match_tags.join(", "));
  const [service, setService] = useState(rule.service_id ?? "");
  const [addon, setAddon] = useState(rule.addon_service_id ?? "");
  const [priority, setPriority] = useState(String(rule.priority));

  return (
    <div className="space-y-3">
      <Field label="Название" value={title} onChange={setTitle} />
      <AreaField label="Пояснение" value={explanation} onChange={setExplanation} rows={3} />
      <Field label="Теги через запятую" value={tags} onChange={setTags} />
      <ServicePicker label="Рекомендуемая услуга" value={service} onChange={setService} services={services} />
      <ServicePicker label="Дополнительная услуга" value={addon} onChange={setAddon} services={services} />
      <Field label="Приоритет" type="number" value={priority} onChange={setPriority} />
      <Button
        variant="outline"
        className="h-11 w-full"
        onClick={() =>
          onSave({
            title: title.trim(),
            explanation: explanation.trim(),
            match_tags: tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean),
            service_id: service || null,
            addon_service_id: addon || null,
            priority: Number(priority) || 0,
          })
        }
      >
        Сохранить правило
      </Button>
    </div>
  );
}

function ServicePicker({
  label,
  value,
  onChange,
  services,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  services: { id: string; name: string }[];
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs text-muted-foreground">{label}</p>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">Не выбрана</option>
        {services.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
    </div>
  );
}
