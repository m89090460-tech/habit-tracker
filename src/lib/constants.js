import { BookOpen, Droplet, Dumbbell, Moon, Utensils, Wallet, FolderOpen, Target } from "lucide-react";

// Har bir odat qanday ikonka bilan ko'rsatilishi mumkinligi
export const ICONS = {
  book: BookOpen,
  drop: Droplet,
  dumbbell: Dumbbell,
  moon: Moon,
  food: Utensils,
  wallet: Wallet,
  folder: FolderOpen,
  target: Target,
};

// Har bir rang uchun: halqa rangi (ring), fon rangi (soft), progress-bar gradienti (bar)
export const COLORS = {
  violet:  { ring: "#7C4DFF", soft: "rgba(124,77,255,0.16)", bar: "from-[#7C4DFF] to-[#5A2EE6]" },
  emerald: { ring: "#34D399", soft: "rgba(52,211,153,0.14)", bar: "from-emerald-400 to-emerald-600" },
  sky:     { ring: "#38BDF8", soft: "rgba(56,189,248,0.14)", bar: "from-sky-400 to-sky-600" },
  amber:   { ring: "#FBBF24", soft: "rgba(251,191,36,0.14)", bar: "from-amber-400 to-amber-600" },
  rose:    { ring: "#FB7185", soft: "rgba(251,113,133,0.14)", bar: "from-rose-400 to-rose-600" },
};
export const WEEKDAYS = [
  { key: "mon", label: "Du" },
  { key: "tue", label: "Se" },
  { key: "wed", label: "Chor" },
  { key: "thu", label: "Pay" },
  { key: "fri", label: "Ju" },
  { key: "sat", label: "Sha" },
  { key: "sun", label: "Yak" },
];

export const CATEGORIES = ["Ta'lim", "Sog'liq", "Moliya", "Boshqa"];

// Ilova birinchi marta ochilganda ko'rinadigan namunaviy odatlar
export const DEFAULT_HABITS = [
  { id: "1", name: "10 bet o'qish", icon: "book", color: "violet", target: 10, unit: "bet", current: 0, category: "Ta'lim", reminderTime: "" },
  { id: "2", name: "Suv ichish", icon: "drop", color: "sky", target: 8, unit: "stakan", current: 0, category: "Sog'liq", reminderTime: "" },
  { id: "3", name: "Mashq qilish", icon: "dumbbell", color: "emerald", target: 1, unit: "marta", current: 0, category: "Sog'liq", reminderTime: "" },
];