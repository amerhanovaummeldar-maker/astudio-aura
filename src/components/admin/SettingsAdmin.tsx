import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AdminSection, AreaField, Card, Field, UploadButton, saveSetting } from "./common";
import { useSettings } from "@/lib/api";

const FIELDS: { key: string; label: string; area?: boolean }[] = [
  { key: "studio_name", label: "Название студии" },
  { key: "address", label: "Адрес" },
  { key: "phone", label: "Телефон" },
  { key: "whatsapp", label: "WhatsApp (номер цифрами)" },
  { key: "telegram", label: "Telegram (@имя или ссылка)" },
  { key: "instagram", label: "Instagram (ссылка)" },
  { key: "vk", label: "ВКонтакте (ссылка)" },
  { key: "working_hours", label: "Часы работы" },
  { key: "time_slots", label: "Время записи через запятую (напр. 10:00, 11:30)" },
  { key: "hero_title", label: "Заголовок на главной" },
  { key: "hero_subtitle", label: "Подзаголовок на главной", area: true },
  { key: "about_text", label: "Текст о студии", area: true },
  { key: "assistant_greeting", label: "Приветствие чат-помощника" },
  { key: "assistant_knowledge", label: "Знания чат-помощника (что он может отвечать)", area: true },
];

export function SettingsAdmin() {
  const { data: settings } = useSettings();
  const qc = useQueryClient();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) setValues((v) => ({ ...settings, ...v }));
  }, [settings]);

  const get = (k: string) => values[k] ?? settings?.[k] ?? "";
  const set = (k: string, v: string) => setValues((prev) => ({ ...prev, [k]: v }));

  async function saveAll() {
    setSaving(true);
    let ok = true;
    for (const f of FIELDS) {
      if (!(await saveSetting(f.key, get(f.key)))) ok = false;
    }
    setSaving(false);
    if (ok) toast.success("Настройки сохранены");
    qc.invalidateQueries({ queryKey: ["settings"] });
  }

  async function saveImage(key: string, url: string) {
    set(key, url);
    if (await saveSetting(key, url)) {
      toast.success("Изображение сохранено");
      qc.invalidateQueries({ queryKey: ["settings"] });
    }
  }

  return (
    <AdminSection title="Настройки" description="Контакты, тексты главной страницы и изображения.">
      <Card>
        {FIELDS.map((f) =>
          f.area ? (
            <AreaField key={f.key} label={f.label} value={get(f.key)} onChange={(v) => set(f.key, v)} />
          ) : (
            <Field key={f.key} label={f.label} value={get(f.key)} onChange={(v) => set(f.key, v)} />
          ),
        )}
        <Button className="h-12 w-full" onClick={saveAll} disabled={saving}>
          {saving ? "Сохраняем..." : "Сохранить настройки"}
        </Button>
      </Card>

      <Card>
        <p className="text-sm text-muted-foreground">Изображения</p>
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton
            label="Логотип"
            accept="image/*"
            folder="brand"
            onUploaded={(u) => saveImage("logo_url", u)}
          />
          {get("logo_url") ? <img src={get("logo_url")} alt="" className="h-12 rounded-md" /> : null}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton
            label="Фото на главной"
            accept="image/*"
            folder="brand"
            onUploaded={(u) => saveImage("hero_image_url", u)}
          />
          {get("hero_image_url") ? (
            <img src={get("hero_image_url")} alt="" className="h-16 rounded-md object-cover" />
          ) : null}
        </div>
      </Card>
    </AdminSection>
  );
}
