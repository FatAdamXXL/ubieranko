/* Global "routines completed" counter backed by Supabase. Public/publishable key only —
 * safe to embed client-side, real access control lives in the DB's Row Level Security
 * policies and the increment_routines_completed() function (see project setup notes).
 * Fails silently offline/on error — this is a nice-to-have on top of the offline-first app,
 * never something the core experience depends on. */
const SUPABASE_URL = "https://mirtrqdybdcdkyehuqqs.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ay5i37jhu50NEhlTgRmyow_wDFqPt5R";

let supabaseClientPromise = null;

function getSupabaseClient() {
  if (!supabaseClientPromise) {
    supabaseClientPromise = import("https://esm.sh/@supabase/supabase-js@2")
      .then(({ createClient }) => createClient(SUPABASE_URL, SUPABASE_ANON_KEY));
  }
  return supabaseClientPromise;
}

const GlobalStats = {
  async fetchRoutinesCompleted() {
    try {
      const client = await getSupabaseClient();
      const { data, error } = await client
        .from("stats")
        .select("value")
        .eq("id", "routines_completed")
        .single();
      if (error) return null;
      return data.value;
    } catch {
      return null;
    }
  },

  async incrementRoutinesCompleted() {
    try {
      const client = await getSupabaseClient();
      const { error } = await client.rpc("increment_routines_completed");
      if (error) return false;
      return true;
    } catch {
      return false;
    }
  },
};
