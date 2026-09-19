import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AdminSection,
  AreaField,
  Card,
  ConfirmDelete,
  Field,
  SelectField,
  useCrud,
} from "./common";
import { SERVICE_CATEGORIES, useServices, type Service } from "@/lib/api";

type Draft = {
  name: string;
  description: string;
  price: string;
  duration_minutes: string;
  category: string;
  position: string;
  published: boolean;
};

const empty: Draft = {
  name: "",
  description: "",
  price: "",
  duration_minutes: "",
  category: SERVICE_CATEGORIES[0],
  position: "0",
  published: true,
};

function toDraft(s: Service): Draft {
  return {
    name: s.name,
    description: s.description ?? "",
    price: s.price == null ? "" : String(s.price),
    duration_minutes: s.duration_minutes == null ? "" : String(s.duration_minutes),
    category: s.category,
    position: String(s.position),
    published: s.published,
  };
}

function toValues(d: Draft) {
  return {
    name: d.name.trim(),
    description: d.description.trim() || null,
    price: d.price === "" ? null : Number(d.price),
    duration_minutes: d.duration_minutes === "" ? null : Number(d.duration_minutes),
    category: d.category,
    position: Number(d.position) || 0,
    published: d.published,
  };
}

export function ServicesAdmin() {
  const { data: services } = useServices(true);
  const crud = useCrud("services", "services");
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<Draft>(empty);

  return (
    <AdminSection
      title="Услуги"
      description="Название, описание, цена, длительность и категория."
      action={
        <Button className="h-11" onClick={() => setCreating((v) => !v)}>
          {creating ? "Закрыть" : "Добавить услугу"}
        </Button>
      }
    >
      {creating ? (
        <Card>
          <DraftForm draft={draft} setDraft={setDraft} />
          <Button
            className="h-11 w-full"
            onClick={async () => {
              if (!draft.name.trim()) return;
              if (await crud.create(toValues(draft))) {
                setDraft(empty);
                setCreating(false);
              }
            }}
          >
            Сохранить услугу
          </Button>
        </Card>
      ) : null}

      <div className="space-y-3">
        {(services ?? []).map((s) => (
          <Card key={s.id}>
            {editId === s.id ? (
              <>
                <DraftForm draft={editDraft} setDraft={setEditDraft} />
                <div className="flex flex-wrap gap-2">
                  <Button
                    className="h-11"
                    onClick={async () => {
                      if (await crud.update(s.id, toValues(editDraft))) setEditId(null);
                    }}
                  >
                    Сохранить
                  </Button>
                  <Button variant="ghost" className="h-11" onClick={() => setEditId(null)}>
                    Отмена
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow">{s.category}</p>
                    <p className="mt-1 text-lg">{s.name}</p>
                    {s.description ? (
                      <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                    ) : null}
                    <p className="mt-1 text-sm text-muted-foreground">
                      {s.price == null ? "Цена не указана" : `${s.price} ₽`}
                      {s.duration_minutes ? ` · ${s.duration_minutes} мин` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {s.published ? "Опубликована" : "Скрыта"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    className="h-11"
                    onClick={() => {
                      setEditId(s.id);
                      setEditDraft(toDraft(s));
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button
                    variant="secondary"
                    className="h-11"
                    onClick={() => crud.update(s.id, { published: !s.published })}
                  >
                    {s.published ? "Скрыть" : "Показать"}
                  </Button>
                  <ConfirmDelete onConfirm={() => crud.remove(s.id)} />
                </div>
              </>
            )}
          </Card>
        ))}
      </div>
    </AdminSection>
  );
}

function DraftForm({ draft, setDraft }: { draft: Draft; setDraft: (d: Draft) => void }) {
  const set = (patch: Partial<Draft>) => setDraft({ ...draft, ...patch });
  return (
    <div className="space-y-3">
      <Field label="Название" value={draft.name} onChange={(v) => set({ name: v })} />
      <AreaField label="Описание" value={draft.description} onChange={(v) => set({ description: v })} />
      <div className="grid grid-cols-2 gap-3">
        <Field label="Цена, ₽" type="number" value={draft.price} onChange={(v) => set({ price: v })} />
        <Field
          label="Длительность, мин"
          type="number"
          value={draft.duration_minutes}
          onChange={(v) => set({ duration_minutes: v })}
        />
      </div>
      <SelectField
        label="Категория"
        value={draft.category}
        onChange={(v) => set({ category: v })}
        options={SERVICE_CATEGORIES}
      />
      <Field label="Порядок" type="number" value={draft.position} onChange={(v) => set({ position: v })} />
    </div>
  );
}
