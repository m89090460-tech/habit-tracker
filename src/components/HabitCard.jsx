import { useRef, useState, useEffect } from "react";
import { motion, Reorder } from "framer-motion";
import { ICONS, COLORS } from "../lib/constants";
import { Plus, Minus, Pencil, Trash2, Bell, GripVertical } from "lucide-react";
import Confetti from "./Confetti";

function HabitCard({ habit, onBump, onEdit, onDelete, t }) {
  const Icon = ICONS[habit.icon];
  const color = COLORS[habit.color];
  const percent = Math.min(100, Math.round((habit.current / habit.target) * 100));
  const done = habit.current >= habit.target;

  const prevDone = useRef(done);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (done && !prevDone.current) {
      setBurst(true);
      const timer = setTimeout(() => setBurst(false), 700);
      return () => clearTimeout(timer);
    }
    prevDone.current = done;
  }, [done]);

  return (
    <Reorder.Item
      value={habit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      whileDrag={{ scale: 1.03, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
      className={`relative group rounded-[24px] border p-4 sm:p-5 mb-3 ${t.card}`}
    >
      {burst && <Confetti />}

      <div className="flex items-center gap-4">
        <GripVertical size={15} className={`${t.muted} cursor-grab active:cursor-grabbing shrink-0`} />

        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
          style={{ background: color.soft }}
        >
          <Icon size={20} style={{ color: color.ring }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className={`text-sm font-medium truncate ${t.strong}`}>{habit.name}</p>
              {habit.reminderTime && (
                <p className={`text-[10px] flex items-center gap-1 mt-0.5 ${t.muted}`}>
                  <Bell size={9} /> {habit.reminderTime}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
              <button onClick={() => onEdit(habit)} className={`${t.muted} hover:text-violet-400 p-1`}>
                <Pencil size={14} />
              </button>
              <button onClick={() => onDelete(habit)} className={`${t.muted} hover:text-rose-400 p-1`}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
          <div className={`w-full h-2 rounded-full mt-2 overflow-hidden ${t.track}`}>
            <div
              className={`h-full rounded-full bg-gradient-to-r ${color.bar}`}
              style={{ width: `${percent}%`, transition: "width 0.4s ease-out" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onBump(habit.id, -1)}
            className={`w-7 h-7 rounded-full flex items-center justify-center ${t.track} ${t.strong}`}
          >
            <Minus size={13} />
          </button>
          <span className={`text-sm font-semibold w-14 text-center ${t.strong}`}>
            {habit.current}/{habit.target}
          </span>
          <button
            onClick={() => onBump(habit.id, 1)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white"
            style={{ background: color.ring }}
          >
            <Plus size={13} />
          </button>
        </div>
      </div>

      {done && (
        <p className="text-[11px] text-emerald-400 mt-2">✓ Bajarildi!</p>
      )}
    </Reorder.Item>
  );
}

export default HabitCard;