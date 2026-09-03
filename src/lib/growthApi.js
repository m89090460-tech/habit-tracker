import { supabase } from "./supabaseClient";

export async function fetchCheckins(userId) {
  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function upsertCheckin(userId, date, habitScore, answers, direction) {
  const { error } = await supabase.from("daily_checkins").upsert(
    {
      user_id: userId,
      date,
      habit_score: habitScore,
      answers: JSON.stringify(answers),
      direction,
    },
    { onConflict: "user_id,date" }
  );
  if (error) throw error;
}