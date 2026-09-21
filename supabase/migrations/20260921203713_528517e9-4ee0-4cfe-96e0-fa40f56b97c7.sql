ALTER TABLE public.services ADD COLUMN IF NOT EXISTS price_from boolean NOT NULL DEFAULT false;

INSERT INTO public.services (name, description, price, price_from, category, position, published) VALUES
('Стрижка', 'Цена указана за короткие волосы, рассчитывается индивидуально.', 2500, true, 'Стрижки', 1, true),
('Окрашивание AIRTOUCH', 'Сложное окрашивание, рассчитывается индивидуально.', 15000, true, 'Блонд / осветление', 2, true),
('Сложные окрашивания', 'Рассчитываются индивидуально для каждого клиента.', 10000, true, 'Окрашивание', 3, true),
('Тонирование волос', 'Уход + тонирование.', 7000, true, 'Окрашивание', 4, true),
('Обесцвечивание корней + тонирование', 'От 7000–8000 ₽, зависит от запущенности корней и сложности.', 7000, true, 'Блонд / осветление', 5, true),
('Мелирование + тонирование', NULL, 7000, true, 'Блонд / осветление', 6, true),
('«Выход» из чёрного', 'Зависит от того, как будет уходить цвет, и от желаемого результата.', 6000, true, 'Окрашивание', 7, true),
('Долговременная укладка / биозавивка', 'Цена указана для стрижки каре.', 8000, true, 'Завивка', 8, true),
('Уходовые процедуры', NULL, 4000, true, 'Уходы', 9, true);

INSERT INTO public.settings (key, value) VALUES
('phone', '+7 916 364-94-74'),
('whatsapp', 'https://wa.me/message/SZCWHLDNK7E4O1'),
('address', 'Московская обл., г. Коломна, ул. Ленина, д. 68'),
('price_note', 'Все окрашивания рассчитываются индивидуально для каждого клиента.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now();