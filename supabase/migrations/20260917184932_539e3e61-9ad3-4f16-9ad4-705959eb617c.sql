
GRANT INSERT, DELETE ON public.user_roles TO authenticated;

CREATE POLICY "bootstrap first admin" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role = 'admin' AND NOT EXISTS (SELECT 1 FROM public.user_roles));

CREATE POLICY "admin manages roles" ON public.user_roles FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'))
  WITH CHECK (EXISTS (SELECT 1 FROM public.user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin'));
