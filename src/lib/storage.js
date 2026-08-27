const STORE_KEY = "habit-tracker-state-v1";

// Saqlangan holatni o'qib olish
export function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.error("Yuklashda xatolik:", e);
    return null;
  }
}

// Holatni saqlash
export function saveState(state) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    return true;
  } catch (e) {
    console.error("Saqlashda xatolik:", e);
    return false;
  }
}