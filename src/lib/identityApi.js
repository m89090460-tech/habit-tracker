import { supabase } from "./supabaseClient";

export async function fetchIdentities(userId) {
  const { data, error } = await supabase
    .from("identities")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function insertIdentity(userId, name, description) {
  const { data, error } = await supabase
    .from("identities")
    .insert({ user_id: userId, name, description })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteIdentity(userId, id) {
  const { error } = await supabase
    .from("identities")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);
  if (error) throw error;
}

/* Har bir identity uchun "ovozlar" sonini hisoblaydi:
   habit target'ga yetgan har bir kun = 1 ovoz shu identity'ga */
export function computeVotes(habits, history) {
  const votes = {};
  habits.forEach((h) => {
    if (!h.identityId) return;
    votes[h.identityId] = votes[h.identityId] || 0;
    if (h.current >= h.target) votes[h.identityId] += 1;
  });
  Object.keys(history).forEach((date) => {
    const snap = history[date];
    habits.forEach((h) => {
      if (!h.identityId) return;
      const val = snap[h.id];
      if (val !== undefined && val >= h.target) {
        votes[h.identityId] = (votes[h.identityId] || 0) + 1;
      }
    });
  });
  return votes;
}