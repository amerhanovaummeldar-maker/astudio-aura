import { useState, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { uploadMedia } from "@/lib/upload";

type Row = Record<string, unknown>;

type QueryResult = Promise<{ error: { message: string } | null }>;

const db = supabase as unknown as {
  from: (table: string) => {
    insert: (values: Row) => QueryResult;
    update: (values: Row) => { eq: (column: string, value: string) => QueryResult };
    delete: () => { eq: (column: string, value: string) => QueryResult };
    upsert: (values: Row, options?: Row) => QueryResult;
  };
};

export function useCrud(table: string, queryKey: string) {
  const qc = useQueryClient();
  const refresh = () => qc.invalidateQueries({ queryKey: [queryKey] });

  return {
    async create(values: Row) {
      const { error } = await db.from(table).insert(values);
      if (error) return toast.error("Не удалось сохранить: " + error.message), false;
      toast.success("Добавлено");
      refresh();
      return true;
    },
    async update(id: string, values: Row) {
      const { error } = await db.from(table).update(values).eq("id", id);
      if (error) return toast.error("Не удалось сохранить: " + error.message), false;
      toast.success("Сохранено");
      refresh();
      return true;
    },
    async remove(id: string) {
      const { error } = await db.from(table).delete().eq("id", id);
      if (error) return toast.error("Не удалось удалить: " + error.message), false;
      toast.success("Удалено");
      refresh();
      return true;
    },
    refresh,
  };
}

export async function saveSetting(key: string, value: string) {
  const { error } = await db.from("settings").upsert({ key, value }, { onConflict: "key" });
  if (error) {
    toast.error("Не удалось сохранить: " + error.message);
    return false;
  }
  return true;
}

export function AdminSection({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="display-title text-2xl">{title}</h2>
          {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

export function Card({ children }: { children: ReactNode }) {
  return <div className="soft-card space-y-3 p-4">{children}</div>;
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11"
      />
    </div>
  );
}

export function AreaField({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export function UploadButton({
  label,
  accept,
  folder,
  onUploaded,
}: {
  label: string;
  accept: string;
  folder: string;
  onUploaded: (url: string, file: File) => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <label className="inline-flex">
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (!file) return;
          setBusy(true);
          try {
            const { url } = await uploadMedia(file, folder);
            onUploaded(url, file);
            toast.success("Файл загружен");
          } catch {
            toast.error("Не удалось загрузить файл");
          } finally {
            setBusy(false);
          }
        }}
      />
      <Button asChild variant="outline" className="h-11" disabled={busy}>
        <span>{busy ? "Загрузка..." : label}</span>
      </Button>
    </label>
  );
}

export function ConfirmDelete({ onConfirm }: { onConfirm: () => void }) {
  const [armed, setArmed] = useState(false);
  if (!armed)
    return (
      <Button variant="ghost" className="h-11 text-destructive" onClick={() => setArmed(true)}>
        Удалить
      </Button>
    );
  return (
    <div className="flex gap-2">
      <Button variant="destructive" className="h-11" onClick={onConfirm}>
        Точно удалить
      </Button>
      <Button variant="ghost" className="h-11" onClick={() => setArmed(false)}>
        Отмена
      </Button>
    </div>
  );
}
