import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Sparkle } from "lucide-react";

function IdentityManager({ identities, votes, onAdd, onDelete, t }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleAdd = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), description.trim());
    setName("");
    setDescription("");
    setShowForm(false);
  };

  return (
    <div className={`rounded-[24px] border p-5 sm:p-6 ${t.card}`}>
      <div className="flex items-center justify-between mb-1">
        <h3 className={`text-sm font-semibold flex items-center gap-2 ${t.strong}`}>
          <Sparkle size={15} className="text-violet-400" /> Kim bo'lmoqchisiz?
        </h3>
        <button
          onClick={() => setShowForm((s) => !s)}
          className={`text-xs font-medium rounded-full px-3 py-1.5 transition-colors ${t.accent}`}
        >
          <Plus size={13} className="inline mr-1" /> Qo'shish
        </button>
      </div>
      <p className={`text-xs mb-4 ${t.muted}`}>
        Har bir bajarilgan odat — shu insonga ovoz. Maqsad emas, kimligingizga e'tibor bering.
      </p>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-4"
          >
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={'Masalan: "Sog\'lom odam"'}
              className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-2 ${t.input} ${t.strong}`}
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qisqa izoh (ixtiyoriy)"
              className={`w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-violet-500 mb-2 ${t.input} ${t.strong}`}
            />
            <button
              onClick={handleAdd}
              className="w-full rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white text-sm font-semibold py-2.5"
            >
              Saqlash
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {identities.map((idn) => {
          const count = votes[idn.id] || 0;
          const max = Math.max(...Object.values(votes), 5);
          const pct = Math.min(100, Math.round((count / max) * 100));
          return (
            <div key={idn.id} className={`rounded-2xl border p-3 ${t.border}`}>
              <div className="flex items-center justify-between mb-1">
                <div>
                  <p className={`text-sm font-medium ${t.strong}`}>{idn.name}</p>
                  {idn.description && (
                    <p className={`text-[11px] ${t.muted}`}>{idn.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-sm font-bold text-violet-400">{count} ovoz</span>
                  <button
                    onClick={() => onDelete(idn.id)}
                    className={`${t.muted} hover:text-rose-400`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${t.track}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6]"
                  style={{ width: `${pct}%`, transition: "width 0.4s ease-out" }}
                />
              </div>
            </div>
          );
        })}
        {identities.length === 0 && (
          <p className={`text-xs text-center py-6 ${t.muted}`}>
            Hali identity yaratilmagan. Kim bo'lishni xohlaysiz?
          </p>
        )}
      </div>
    </div>
  );
}

export default IdentityManager;