import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AdminSection,
  AreaField,
  Card,
  ConfirmDelete,
  Field,
  SelectField,
  UploadButton,
  useCrud,
} from "./common";
import { PORTFOLIO_CATEGORIES, usePortfolio } from "@/lib/api";

export function PortfolioAdmin({ mediaType }: { mediaType: "photo" | "video" }) {
  const { data: items } = usePortfolio(true);
  const crud = useCrud("portfolio_items", "portfolio");
  const list = (items ?? []).filter((i) => i.media_type === mediaType);

  const [url, setUrl] = useState("");
  const [poster, setPoster] = useState("");
  const [category, setCategory] = useState<string>(PORTFOLIO_CATEGORIES[0]);
  const [description, setDescription] = useState("");

  const isVideo = mediaType === "video";

  async function move(id: string, position: number, delta: number) {
    await crud.update(id, { position: position + delta });
  }

  return (
    <AdminSection
      title={isVideo ? "Видео" : "Фотографии"}
      description={
        isVideo
          ? "Короткие вертикальные видео с телефона. Загрузите, выберите категорию и опубликуйте."
          : "Фотографии работ. Загрузите, выберите категорию и опубликуйте."
      }
    >
      <Card>
        <p className="text-sm text-muted-foreground">Новая работа</p>
        <div className="flex flex-wrap items-center gap-3">
          <UploadButton
            label={isVideo ? "Выбрать видео" : "Выбрать фото"}
            accept={isVideo ? "video/*" : "image/*"}
            folder={isVideo ? "video" : "photo"}
            onUploaded={(u) => setUrl(u)}
          />
          {isVideo ? (
            <UploadButton
              label="Обложка (необязательно)"
              accept="image/*"
              folder="poster"
              onUploaded={(u) => setPoster(u)}
            />
          ) : null}
          {url ? <span className="text-sm text-muted-foreground">Файл загружен</span> : null}
        </div>
        {url ? (
          <div className="max-w-[220px] overflow-hidden rounded-lg border border-border">
            {isVideo ? (
              <video src={url} poster={poster || undefined} controls playsInline className="w-full" />
            ) : (
              <img src={url} alt="" className="w-full" />
            )}
          </div>
        ) : null}
        <SelectField
          label="Категория"
          value={category}
          onChange={setCategory}
          options={PORTFOLIO_CATEGORIES}
        />
        <AreaField label="Описание" value={description} onChange={setDescription} rows={2} />
        <Button
          className="h-11 w-full"
          disabled={!url}
          onClick={async () => {
            const ok = await crud.create({
              media_url: url,
              media_type: mediaType,
              poster_url: poster || null,
              category,
              description: description.trim() || null,
              published: true,
              position: 0,
            });
            if (ok) {
              setUrl("");
              setPoster("");
              setDescription("");
            }
          }}
        >
          Опубликовать
        </Button>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((item) => (
          <Card key={item.id}>
            <div className="overflow-hidden rounded-lg border border-border">
              {item.media_type === "video" ? (
                <video
                  src={item.media_url}
                  poster={item.poster_url ?? undefined}
                  controls
                  playsInline
                  className="max-h-72 w-full object-cover"
                />
              ) : (
                <img src={item.media_url} alt="" className="max-h-72 w-full object-cover" />
              )}
            </div>
            <ItemEditor
              category={item.category}
              description={item.description ?? ""}
              onSave={(c, d) => crud.update(item.id, { category: c, description: d || null })}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="h-11"
                onClick={() => crud.update(item.id, { published: !item.published })}
              >
                {item.published ? "Скрыть" : "Показать"}
              </Button>
              <Button variant="outline" className="h-11" onClick={() => move(item.id, item.position, -1)}>
                Выше
              </Button>
              <Button variant="outline" className="h-11" onClick={() => move(item.id, item.position, 1)}>
                Ниже
              </Button>
              <UploadButton
                label="Заменить файл"
                accept={isVideo ? "video/*" : "image/*"}
                folder={isVideo ? "video" : "photo"}
                onUploaded={(u) => crud.update(item.id, { media_url: u })}
              />
              <ConfirmDelete onConfirm={() => crud.remove(item.id)} />
            </div>
          </Card>
        ))}
      </div>
    </AdminSection>
  );
}

function ItemEditor({
  category,
  description,
  onSave,
}: {
  category: string;
  description: string;
  onSave: (category: string, description: string) => void;
}) {
  const [c, setC] = useState(category);
  const [d, setD] = useState(description);
  return (
    <div className="space-y-3">
      <SelectField label="Категория" value={c} onChange={setC} options={PORTFOLIO_CATEGORIES} />
      <Field label="Описание" value={d} onChange={setD} />
      <Button variant="outline" className="h-11 w-full" onClick={() => onSave(c, d)}>
        Сохранить изменения
      </Button>
    </div>
  );
}
