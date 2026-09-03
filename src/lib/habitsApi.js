import { supabase } from "./supabaseClient";

const todayStr = () => new Date().toISOString().slice(0, 10);

function fromRow(row) {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    target: row.target,
    unit: row.unit,
    current: row.current,
    category: row.category,
    trigger: row.trigger || "",
    stackAfter: row.stack_after || "",
    reminderTime: row.reminder_time || "",
    days: JSON.parse(row.days || "[]"),
    sortOrder: row.sort_order,
    lastResetDate: row.last_reset_date,
    cue: row.cue || "",
    craving: row.craving || "",
    response: row.response || "",
    reward: row.reward || "",
    location: row.location || "",
    durationMinutes: row.duration_minutes || 0,
    contractText: row.contract_text || "",
    contractDeadline: row.contract_deadline || "",
    contractSignedAt: row.contract_signed_at || null,
    identityId: row.identity_id || null,
  };
}

function toRow(habit, userId) {
  return {
    user_id: userId,
    name: habit.name,
    icon: habit.icon,
    color: habit.color,
    target: habit.target,
    unit: habit.unit,
    category: habit.category,
    trigger: habit.trigger || "",
    stack_after: habit.stackAfter || "",
    reminder_time: habit.reminderTime || "",
    days: JSON.stringify(habit.days || []),
    cue: habit.cue || "",
    craving: habit.craving || "",
    response: habit.response || "",
    reward: habit.reward || "",
    location: habit.location || "",
    duration_minutes: habit.durationMinutes || 0,
    contract_text: habit.contractText || "",
    contract_deadline: habit.contractDeadline || null,
    contract_signed_at: habit.contractSignedAt || null,
   identity_id: habit.identityId || null,
  };
}

export async function fetchHabits(userId) {
  const { data, error } = await supabase
    .from("habits")
    .select("*")
    .eq("user_id", userId)
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return data.map(fromRow);
}

export async function fetchHistory(userId) {
  const { data, error } = await supabase
    .from("habit_history")
    .select("*")
    .eq("user_id", userId);
  if (error) throw error;
  const history = {};
  data.forEach((row) => {
    if (!history[row.date]) history[row.date] = {};
    history[row.date][row.habit_id] = row.value;
  });
  return history;
}

export async function insertHabit(userId, habit, sortOrder) {
  const { data, error } = await supabase
    .from("habits")
    .insert({ ...toRow(habit, userId), current: 0, sort_order: sortOrder, last_reset_date: todayStr() })
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}

export async function updateHabit(userId, habit) {
  const { error } = await supabase
    .from("habits")
    .update(toRow(habit, userId))
    .eq("id", habit.id)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function updateHabitCurrent(userId, habitId, current) {
  const { error } = await supabase
    .from("habits")
    .update({ current })
    .eq("id", habitId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function deleteHabit(userId, habitId) {
  const { error } = await supabase
    .from("habits")
    .delete()
    .eq("id", habitId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function persistSortOrder(userId, orderedHabits) {
  await Promise.all(
    orderedHabits.map((h, i) =>
      supabase.from("habits").update({ sort_order: i }).eq("id", h.id).eq("user_id", userId)
    )
  );
}

async function archiveEntry(userId, habitId, date, value) {
  const { error } = await supabase
    .from("habit_history")
    .upsert({ user_id: userId, habit_id: habitId, date, value }, { onConflict: "habit_id,date" });
  if (error) throw error;
}

export async function rolloverDay(userId, habits) {
  const today = todayStr();
  const result = [];
  for (const h of habits) {
    if (h.lastResetDate && h.lastResetDate !== today) {
      await archiveEntry(userId, h.id, h.lastResetDate, h.current);
      await supabase
        .from("habits")
        .update({ current: 0, last_reset_date: today })
        .eq("id", h.id)
        .eq("user_id", userId);
      result.push({ ...h, current: 0, lastResetDate: today });
    } else {
      result.push(h);
    }
  }
  return result;
}