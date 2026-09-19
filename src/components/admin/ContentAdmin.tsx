import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AdminSection,
  AreaField,
  Card,
  ConfirmDelete,
  Field,
  UploadButton,
  useCrud,
} from "./common";
import { useArticles, useReviews, useBookings, useCertificates, formatPrice } from "@/lib/api";

export function ReviewsAdmin() {
  const { data: reviews } = useReviews(true);
  const crud = useCrud("reviews", "reviews");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  return (
    <AdminSection title="Отзывы" description="Добавляйте только реальные отзывы клиентов.">
      <Card>
        <Field label="Имя клиента" value={name} onChange={setName} />
        <AreaField label="Текст отзыва" value={text} onChange={setText} />
        <Field label="Дата" type="date" value={date} onChange={setDate} />
        <div className="flex items-center gap-3">
          <UploadButton label="Фото (необязательно)" accept="image/*" folder="reviews" onUploaded={setPhoto} />
          {photo ? <span className="text-sm text-muted-foreground">Фото загружено</span> : null}
        </div>
        <Button
          className="h-11 w-full"
          disabled={!name.trim() || !text.trim()}
          onClick={async () => {
            const ok = await crud.create({
              client_name: name.trim(),
              text: text.trim(),
              photo_url: photo || null,
              review_date: date,
              published: true,
            });
            if (ok) {
              setName("");
              setText("");
              setPhoto("");
            }
          }}
        >
          Добавить отзыв
        </Button>
      </Card>

      <div className="space-y-3">
        {(reviews ?? []).map((r) => (
          <Card key={r.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base">{r.client_name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {new Date(r.review_date).toLocaleDateString("ru-RU")}
                </p>
              </div>
              {r.photo_url ? <img src={r.photo_url} alt="" className="size-16 rounded-lg object-cover" /> : null}
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="h-11"
                onClick={() => crud.update(r.id, { published: !r.published })}
              >
                {r.published ? "Скрыть" : "Показать"}
              </Button>
              <ConfirmDelete onConfirm={() => crud.remove(r.id)} />
            </div>
          </Card>
        ))}
      </div>
    </AdminSection>
  );
}

export function ArticlesAdmin() {
  const { data: articles } = useArticles(true);
  const crud = useCrud("articles", "articles");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [cover, setCover] = useState("");

  return (
    <AdminSection title="Уход" description="Советы и статьи «Секрет долго сохраняющейся красоты».">
      <Card>
        <Field label="Заголовок" value={title} onChange={setTitle} />
        <AreaField label="Краткое описание" value={excerpt} onChange={setExcerpt} rows={2} />
        <AreaField label="Текст" value={body} onChange={setBody} rows={6} />
        <div className="flex items-center gap-3">
          <UploadButton label="Обложка" accept="image/*" folder="articles" onUploaded={setCover} />
          {cover ? <span className="text-sm text-muted-foreground">Обложка загружена</span> : null}
        </div>
        <Button
          className="h-11 w-full"
          disabled={!title.trim()}
          onClick={async () => {
            const ok = await crud.create({
              title: title.trim(),
              excerpt: excerpt.trim() || null,
              body: body.trim() || null,
              cover_url: cover || null,
              published: true,
              position: 0,
            });
            if (ok) {
              setTitle("");
              setExcerpt("");
              setBody("");
              setCover("");
            }
          }}
        >
          Опубликовать статью
        </Button>
      </Card>

      <div className="space-y-3">
        {(articles ?? []).map((a) => (
          <Card key={a.id}>
            <ArticleEditor
              title={a.title}
              excerpt={a.excerpt ?? ""}
              body={a.body ?? ""}
              onSave={(v) => crud.update(a.id, v)}
            />
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                className="h-11"
                onClick={() => crud.update(a.id, { published: !a.published })}
              >
                {a.published ? "Скрыть" : "Показать"}
              </Button>
              <UploadButton
                label="Заменить обложку"
                accept="image/*"
                folder="articles"
                onUploaded={(u) => crud.update(a.id, { cover_url: u })}
              />
              <ConfirmDelete onConfirm={() => crud.remove(a.id)} />
            </div>
          </Card>
        ))}
      </div>
    </AdminSection>
  );
}

function ArticleEditor({
  title,
  excerpt,
  body,
  onSave,
}: {
  title: string;
  excerpt: string;
  body: string;
  onSave: (values: { title: string; excerpt: string | null; body: string | null }) => void;
}) {
  const [t, setT] = useState(title);
  const [e, setE] = useState(excerpt);
  const [b, setB] = useState(body);
  return (
    <div className="space-y-3">
      <Field label="Заголовок" value={t} onChange={setT} />
      <AreaField label="Краткое описание" value={e} onChange={setE} rows={2} />
      <AreaField label="Текст" value={b} onChange={setB} rows={5} />
      <Button
        variant="outline"
        className="h-11 w-full"
        onClick={() => onSave({ title: t.trim(), excerpt: e.trim() || null, body: b.trim() || null })}
      >
        Сохранить
      </Button>
    </div>
  );
}

const STATUSES = ["new", "confirmed", "done", "cancelled"] as const;
const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  done: "Выполнена",
  cancelled: "Отменена",
};

export function BookingsAdmin() {
  const { data: bookings } = useBookings();
  const crud = useCrud("bookings", "bookings");

  return (
    <AdminSection title="Записи" description="Заявки клиентов на запись.">
      <div className="space-y-3">
        {(bookings ?? []).map((b) => (
          <Card key={b.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base">
                  {new Date(b.booking_date).toLocaleDateString("ru-RU")} · {b.booking_time}
                </p>
                <p className="mt-1 text-sm">{b.service_name ?? "Консультация"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {b.client_name} ·{" "}
                  <a className="underline underline-offset-4" href={`tel:${b.client_phone.replace(/[^\d+]/g, "")}`}>
                    {b.client_phone}
                  </a>
                </p>
                {b.comment ? <p className="mt-1 text-sm text-muted-foreground">{b.comment}</p> : null}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{STATUS_LABELS[b.status] ?? b.status}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATUSES.filter((s) => s !== b.status).map((s) => (
                <Button
                  key={s}
                  variant="outline"
                  className="h-11"
                  onClick={() => crud.update(b.id, { status: s })}
                >
                  {STATUS_LABELS[s]}
                </Button>
              ))}
              <ConfirmDelete onConfirm={() => crud.remove(b.id)} />
            </div>
          </Card>
        ))}
        {!(bookings ?? []).length ? (
          <p className="text-sm text-muted-foreground">Записей пока нет.</p>
        ) : null}
      </div>
    </AdminSection>
  );
}

export function CertificatesAdmin() {
  const { data: certificates } = useCertificates();
  const crud = useCrud("gift_certificates", "certificates");

  return (
    <AdminSection title="Подарочные сертификаты" description="Оформленные сертификаты.">
      <div className="space-y-3">
        {(certificates ?? []).map((c) => (
          <Card key={c.id}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-base">
                  {formatPrice(c.amount)} · код {c.code}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Кому: {c.recipient_name} · От: {c.sender_name}
                </p>
                {c.message ? <p className="mt-1 text-sm text-muted-foreground">«{c.message}»</p> : null}
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {c.status === "new" ? "Новый" : c.status === "paid" ? "Оплачен" : "Использован"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="h-11" onClick={() => crud.update(c.id, { status: "paid" })}>
                Оплачен
              </Button>
              <Button variant="outline" className="h-11" onClick={() => crud.update(c.id, { status: "used" })}>
                Использован
              </Button>
              <ConfirmDelete onConfirm={() => crud.remove(c.id)} />
            </div>
          </Card>
        ))}
        {!(certificates ?? []).length ? (
          <p className="text-sm text-muted-foreground">Сертификатов пока нет.</p>
        ) : null}
      </div>
    </AdminSection>
  );
}
