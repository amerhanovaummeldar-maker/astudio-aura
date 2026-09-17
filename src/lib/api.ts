import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const SERVICE_CATEGORIES = [
  "Стрижки",
  "Окрашивание",
  "Блонд / осветление",
  "Работа с сединой",
  "Уходы",
  "Завивка",
  "Укладка",
] as const;

export const PORTFOLIO_CATEGORIES = [
  "Окрашивание",
  "Блонд",
  "Седина",
  "Стрижки",
  "Уход",
  "Завивка",
  "До / После",
] as const;

export type Settings = Record<string, string>;

export type Service = {
  id: string;
  name: string;
  description: string | null;
  price: number | null;
  duration_minutes: number | null;
  category: string;
  position: number;
  published: boolean;
};

export type PortfolioItem = {
  id: string;
  media_url: string;
  media_type: string;
  poster_url: string | null;
  category: string;
  description: string | null;
  position: number;
  published: boolean;
};

export type Review = {
  id: string;
  client_name: string;
  text: string;
  photo_url: string | null;
  review_date: string;
  published: boolean;
};

export type Article = {
  id: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  published: boolean;
  position: number;
};

export type Booking = {
  id: string;
  service_id: string | null;
  service_name: string | null;
  booking_date: string;
  booking_time: string;
  client_name: string;
  client_phone: string;
  comment: string | null;
  status: string;
  created_at: string;
};

export type QuizQuestion = {
  id: string;
  text: string;
  position: number;
  published: boolean;
};

export type QuizOption = {
  id: string;
  question_id: string;
  label: string;
  tag: string;
  position: number;
};

export type RecommendationRule = {
  id: string;
  title: string;
  explanation: string;
  match_tags: string[];
  service_id: string | null;
  addon_service_id: string | null;
  priority: number;
  is_default: boolean;
};

export type GiftCertificate = {
  id: string;
  code: string;
  amount: number;
  recipient_name: string;
  sender_name: string;
  message: string | null;
  design: string;
  status: string;
  created_at: string;
};

export const DEFAULT_TIME_SLOTS = [
  "10:00",
  "11:30",
  "13:00",
  "14:30",
  "16:00",
  "17:30",
];

async function fetchSettings(): Promise<Settings> {
  const { data, error } = await supabase.from("settings").select("key, value");
  if (error) throw error;
  const map: Settings = {};
  for (const row of data ?? []) map[row.key] = row.value ?? "";
  return map;
}

export function useSettings() {
  return useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
}

export function useServices(all = false) {
  return useQuery({
    queryKey: ["services", all],
    queryFn: async () => {
      let q = supabase.from("services").select("*").order("position").order("name");
      if (!all) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Service[];
    },
  });
}

export function usePortfolio(all = false) {
  return useQuery({
    queryKey: ["portfolio", all],
    queryFn: async () => {
      let q = supabase
        .from("portfolio_items")
        .select("*")
        .order("position")
        .order("created_at", { ascending: false });
      if (!all) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as PortfolioItem[];
    },
  });
}

export function useReviews(all = false) {
  return useQuery({
    queryKey: ["reviews", all],
    queryFn: async () => {
      let q = supabase.from("reviews").select("*").order("review_date", { ascending: false });
      if (!all) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Review[];
    },
  });
}

export function useArticles(all = false) {
  return useQuery({
    queryKey: ["articles", all],
    queryFn: async () => {
      let q = supabase.from("articles").select("*").order("position");
      if (!all) q = q.eq("published", true);
      const { data, error } = await q;
      if (error) throw error;
      return (data ?? []) as Article[];
    },
  });
}

export function useQuiz() {
  return useQuery({
    queryKey: ["quiz"],
    queryFn: async () => {
      const [{ data: questions, error: qe }, { data: options, error: oe }] = await Promise.all([
        supabase.from("quiz_questions").select("*").eq("published", true).order("position"),
        supabase.from("quiz_options").select("*").order("position"),
      ]);
      if (qe) throw qe;
      if (oe) throw oe;
      return {
        questions: (questions ?? []) as QuizQuestion[],
        options: (options ?? []) as QuizOption[],
      };
    },
  });
}

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recommendation_rules")
        .select("*")
        .order("priority", { ascending: false });
      if (error) throw error;
      return (data ?? []) as RecommendationRule[];
    },
  });
}

export function useBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("booking_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Booking[];
    },
  });
}

export function useCertificates() {
  return useQuery({
    queryKey: ["certificates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gift_certificates")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as GiftCertificate[];
    },
  });
}

export function pickRecommendation(tags: string[], rules: RecommendationRule[]) {
  let best: { rule: RecommendationRule; score: number } | null = null;
  for (const rule of rules) {
    if (rule.is_default) continue;
    const score = rule.match_tags.filter((t) => tags.includes(t)).length;
    if (score > 0 && (!best || score > best.score || (score === best.score && rule.priority > best.rule.priority))) {
      best = { rule, score };
    }
  }
  if (best) return best.rule;
  return rules.find((r) => r.is_default) ?? null;
}

export function formatPrice(price: number | null) {
  if (price == null) return "Цена по запросу";
  return `${new Intl.NumberFormat("ru-RU").format(Number(price))} ₽`;
}

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function waHref(value: string) {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? `https://wa.me/${digits}` : "";
}

export function tgHref(value: string) {
  if (!value) return "";
  if (value.startsWith("http")) return value;
  return `https://t.me/${value.replace(/^@/, "")}`;
}
