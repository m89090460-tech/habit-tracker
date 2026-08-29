import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabaseClient";
import { Mail, Lock, Loader2 } from "lucide-react";

function Auth() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setInfo("Ro'yxatdan o'tdingiz! Endi kirishingiz mumkin.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm rounded-[24px] bg-slate-900 border border-slate-800 p-8"
      >
        <h1 className="text-xl font-semibold mb-1">Habit Tracker</h1>
        <p className="text-sm text-slate-400 mb-6">
          {mode === "signin" ? "Hisobingizga kiring" : "Yangi hisob yarating"}
        </p>

        <form onSubmit={handleSubmit}>
          <label className="text-xs text-slate-400 mb-1.5 block">Email</label>
          <div className="relative mb-4">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="siz@misol.com"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500"
            />
          </div>

          <label className="text-xs text-slate-400 mb-1.5 block">Parol</label>
          <div className="relative mb-5">
            <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kamida 6 belgi"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 pl-9 pr-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-violet-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 mb-4 bg-rose-500/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
          {info && (
            <p className="text-xs text-emerald-400 mb-4 bg-emerald-500/10 rounded-lg px-3 py-2">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white text-sm font-semibold py-3 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            {mode === "signin" ? "Kirish" : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <button
          onClick={() => {
            setMode((m) => (m === "signin" ? "signup" : "signin"));
            setError("");
            setInfo("");
          }}
          className="w-full text-center text-xs text-slate-400 mt-4 hover:text-slate-300"
        >
          {mode === "signin"
            ? "Hisobingiz yo'qmi? Ro'yxatdan o'ting"
            : "Hisobingiz bormi? Kiring"}
        </button>
      </motion.div>
    </div>
  );
}

export default Auth;