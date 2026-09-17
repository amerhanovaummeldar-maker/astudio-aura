
DROP POLICY "settings admin write" ON public.settings;
DROP POLICY "services public read" ON public.services;
DROP POLICY "services admin write" ON public.services;
DROP POLICY "portfolio public read" ON public.portfolio_items;
DROP POLICY "portfolio admin write" ON public.portfolio_items;
DROP POLICY "reviews public read" ON public.reviews;
DROP POLICY "reviews admin write" ON public.reviews;
DROP POLICY "articles public read" ON public.articles;
DROP POLICY "articles admin write" ON public.articles;
DROP POLICY "bookings admin read" ON public.bookings;
DROP POLICY "bookings admin update" ON public.bookings;
DROP POLICY "bookings admin delete" ON public.bookings;
DROP POLICY "quiz questions public read" ON public.quiz_questions;
DROP POLICY "quiz questions admin write" ON public.quiz_questions;
DROP POLICY "quiz options admin write" ON public.quiz_options;
DROP POLICY "rules admin write" ON public.recommendation_rules;
DROP POLICY "certificates admin read" ON public.gift_certificates;
DROP POLICY "certificates admin write" ON public.gift_certificates;
DROP POLICY "certificates admin delete" ON public.gift_certificates;

DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

CREATE POLICY "settings admin write" ON public.settings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "services public read" ON public.services FOR SELECT USING (published);
CREATE POLICY "services admin all" ON public.services FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "portfolio public read" ON public.portfolio_items FOR SELECT USING (published);
CREATE POLICY "portfolio admin all" ON public.portfolio_items FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (published);
CREATE POLICY "reviews admin all" ON public.reviews FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "articles public read" ON public.articles FOR SELECT USING (published);
CREATE POLICY "articles admin all" ON public.articles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "bookings admin all" ON public.bookings FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "quiz questions public read" ON public.quiz_questions FOR SELECT USING (published);
CREATE POLICY "quiz questions admin all" ON public.quiz_questions FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "quiz options admin all" ON public.quiz_options FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "rules admin all" ON public.recommendation_rules FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));

CREATE POLICY "certificates admin all" ON public.gift_certificates FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
