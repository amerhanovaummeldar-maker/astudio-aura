
-- roles
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column() RETURNS trigger
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- settings (key/value)
CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.settings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.settings TO authenticated;
GRANT ALL ON public.settings TO service_role;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "settings public read" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings admin write" ON public.settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

INSERT INTO public.settings (key, value) VALUES
  ('studio_name', 'А&Астудия'),
  ('address', 'МО, г. Коломна'),
  ('phone', '8-916-364-94-74'),
  ('whatsapp', '79163649474'),
  ('telegram', ''),
  ('instagram', ''),
  ('vk', ''),
  ('working_hours', ''),
  ('hero_title', 'Ваш идеальный образ начинается здесь'),
  ('hero_subtitle', 'Персональный уход, цвет и стиль, подобранные именно для вас.'),
  ('hero_image_url', ''),
  ('logo_url', ''),
  ('about_text', ''),
  ('assistant_greeting', 'Здравствуйте! Какой образ мы сегодня создаём?'),
  ('assistant_knowledge', '');

-- services
CREATE TABLE public.services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric,
  duration_minutes integer,
  category text NOT NULL DEFAULT 'Стрижки',
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "services public read" ON public.services FOR SELECT USING (published OR public.is_admin());
CREATE POLICY "services admin write" ON public.services FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- portfolio (photos + videos)
CREATE TABLE public.portfolio_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  media_url text NOT NULL,
  media_type text NOT NULL DEFAULT 'photo',
  poster_url text,
  category text NOT NULL DEFAULT 'Окрашивание',
  description text,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.portfolio_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolio_items TO authenticated;
GRANT ALL ON public.portfolio_items TO service_role;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "portfolio public read" ON public.portfolio_items FOR SELECT USING (published OR public.is_admin());
CREATE POLICY "portfolio admin write" ON public.portfolio_items FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER portfolio_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- reviews
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  text text NOT NULL,
  photo_url text,
  review_date date NOT NULL DEFAULT current_date,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.reviews TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (published OR public.is_admin());
CREATE POLICY "reviews admin write" ON public.reviews FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- articles
CREATE TABLE public.articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  excerpt text,
  body text,
  cover_url text,
  published boolean NOT NULL DEFAULT true,
  position integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.articles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.articles TO authenticated;
GRANT ALL ON public.articles TO service_role;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "articles public read" ON public.articles FOR SELECT USING (published OR public.is_admin());
CREATE POLICY "articles admin write" ON public.articles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER articles_updated BEFORE UPDATE ON public.articles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- bookings
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  service_name text,
  booking_date date NOT NULL,
  booking_time text NOT NULL,
  client_name text NOT NULL,
  client_phone text NOT NULL,
  comment text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.bookings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bookings anyone create" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings admin read" ON public.bookings FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "bookings admin update" ON public.bookings FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "bookings admin delete" ON public.bookings FOR DELETE TO authenticated USING (public.is_admin());
CREATE TRIGGER bookings_updated BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- quiz
CREATE TABLE public.quiz_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  text text NOT NULL,
  position integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.quiz_questions TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_questions TO authenticated;
GRANT ALL ON public.quiz_questions TO service_role;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz questions public read" ON public.quiz_questions FOR SELECT USING (published OR public.is_admin());
CREATE POLICY "quiz questions admin write" ON public.quiz_questions FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.quiz_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES public.quiz_questions(id) ON DELETE CASCADE,
  label text NOT NULL,
  tag text NOT NULL,
  position integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.quiz_options TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.quiz_options TO authenticated;
GRANT ALL ON public.quiz_options TO service_role;
ALTER TABLE public.quiz_options ENABLE ROW LEVEL SECURITY;
CREATE POLICY "quiz options public read" ON public.quiz_options FOR SELECT USING (true);
CREATE POLICY "quiz options admin write" ON public.quiz_options FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.recommendation_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  explanation text NOT NULL,
  match_tags text[] NOT NULL DEFAULT '{}',
  service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  addon_service_id uuid REFERENCES public.services(id) ON DELETE SET NULL,
  priority integer NOT NULL DEFAULT 0,
  is_default boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.recommendation_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.recommendation_rules TO authenticated;
GRANT ALL ON public.recommendation_rules TO service_role;
ALTER TABLE public.recommendation_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rules public read" ON public.recommendation_rules FOR SELECT USING (true);
CREATE POLICY "rules admin write" ON public.recommendation_rules FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- gift certificates
CREATE TABLE public.gift_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE DEFAULT upper(substr(replace(gen_random_uuid()::text,'-',''),1,8)),
  amount numeric NOT NULL,
  recipient_name text NOT NULL,
  sender_name text NOT NULL,
  message text,
  design text NOT NULL DEFAULT 'powder',
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.gift_certificates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gift_certificates TO authenticated;
GRANT ALL ON public.gift_certificates TO service_role;
ALTER TABLE public.gift_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "certificates anyone create" ON public.gift_certificates FOR INSERT WITH CHECK (true);
CREATE POLICY "certificates admin read" ON public.gift_certificates FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "certificates admin write" ON public.gift_certificates FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "certificates admin delete" ON public.gift_certificates FOR DELETE TO authenticated USING (public.is_admin());

-- quiz seed (questions/options from the studio brief)
WITH q AS (
  INSERT INTO public.quiz_questions (text, position) VALUES
    ('Какие у вас волосы сейчас?', 1),
    ('Где вы обычно красите волосы?', 2),
    ('Есть ли у вас сейчас окрашивание или осветление?', 3),
    ('Что вас сейчас больше всего беспокоит?', 4),
    ('Какого результата вы хотите?', 5)
  RETURNING id, position
)
INSERT INTO public.quiz_options (question_id, label, tag, position)
SELECT q.id, o.label, o.tag, o.pos FROM q JOIN (VALUES
  (1,'Сухие','dry',1),
  (1,'Нормальные','normal',2),
  (1,'Жирные у корней','oily_roots',3),
  (1,'Сухие по длине, жирные у корней','mixed',4),
  (2,'Дома','home_color',1),
  (2,'В салоне','salon_color',2),
  (2,'Иногда дома, иногда в салоне','mixed_color',3),
  (2,'Сейчас не крашу','no_color',4),
  (3,'Блонд / осветление','blonde',1),
  (3,'Окрашивание в тёмные оттенки','dark',2),
  (3,'Мелирование','highlights',3),
  (3,'Натуральные волосы','natural',4),
  (3,'Другое','other',5),
  (4,'Сухость','dryness',1),
  (4,'Ломкость','brittle',2),
  (4,'Отсутствие блеска','no_shine',3),
  (4,'Седина','grey',4),
  (4,'Нежелательный оттенок','unwanted_tone',5),
  (4,'Хочу изменить образ','change_look',6),
  (5,'Красивый естественный цвет','goal_natural_color',1),
  (5,'Восстановить и увлажнить волосы','goal_care',2),
  (5,'Изменить цвет','goal_change_color',3),
  (5,'Новую стрижку','goal_haircut',4),
  (5,'Завивку','goal_perm',5),
  (5,'Подобрать комплексный уход','goal_full_care',6)
) AS o(qpos, label, tag, pos) ON o.qpos = q.position;

INSERT INTO public.recommendation_rules (title, explanation, match_tags, priority, is_default) VALUES
  ('Консультация и подбор ухода', 'Мастер студии подберёт программу ухода и цвет лично для вас на консультации.', '{}', 0, true),
  ('Уход для сухих и повреждённых волос', 'Вы отметили сухость и ломкость — начнём с восстановления и увлажнения, затем перейдём к цвету.', '{dry,dryness,brittle,goal_care}', 30, false),
  ('Работа с блондом', 'Вы носите блонд — важно бережное осветление и тонирование, чтобы сохранить качество волос.', '{blonde,unwanted_tone}', 25, false),
  ('Деликатное окрашивание седины', 'Вы отметили седину — подберём стойкий и при этом мягкий состав для комфортного результата.', '{grey}', 25, false),
  ('Смена образа: стрижка и цвет', 'Вы хотите перемен — обсудим форму, длину и оттенок, которые подойдут именно вам.', '{change_look,goal_haircut,goal_change_color}', 20, false),
  ('Завивка и форма', 'Вы хотите завивку — подберём состав и форму локона под структуру ваших волос.', '{goal_perm}', 20, false);
