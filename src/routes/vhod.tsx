import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/lib/useAdmin";

export const Route = createFileRoute("/vhod")({
  head: () => ({
    meta: [
      { title: "Вход — А&Астудия" },
      { name: "description", content: "Вход в панель управления студии А&Астудия." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Вход — А&Астудия" },
      { property: "og:description", content: "Вход в панель управления студии." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuthUser();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/admin", replace: true });
  }, [loading, user, navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error("Неверный e-mail или пароль");
      navigate({ to: "/admin", replace: true });
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/vhod` },
      });
      if (error) {
        setBusy(false);
        return toast.error(error.message);
      }
      const uid = data.user?.id;
      if (uid && data.session) {
        await supabase.from("user_roles").insert({ user_id: uid, role: "admin" });
      }
      setBusy(false);
      toast.success(data.session ? "Аккаунт создан" : "Подтвердите e-mail из письма");
      if (data.session) navigate({ to: "/admin", replace: true });
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="display-title block text-center text-2xl">
          А&Астудия
        </Link>
        <p className="mt-2 text-center text-sm text-muted-foreground">Панель управления</p>

        <form onSubmit={submit} className="soft-card mt-8 space-y-4 p-5">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12"
              minLength={6}
              required
            />
          </div>
          <Button type="submit" className="h-12 w-full" disabled={busy}>
            {busy ? "Подождите..." : mode === "login" ? "Войти" : "Создать аккаунт"}
          </Button>
          <button
            type="button"
            className="w-full text-center text-sm text-muted-foreground underline-offset-4 hover:underline"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Первый вход? Создать аккаунт" : "У меня уже есть аккаунт"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Первый созданный аккаунт становится администратором студии.
        </p>
      </div>
    </div>
  );
}
