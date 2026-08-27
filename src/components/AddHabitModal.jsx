import { useState } from "react";
import { ICONS, COLORS, CATEGORIES, WEEKDAYS } from "../lib/constants";
import { THEME } from "../lib/theme";
import { X } from "lucide-react";

function AddHabitModal({ onClose, onSave, initial, t = THEME.dark }) {
  const isEditing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [target, setTarget] = useState(initial?.target ?? 1);
  const [unit, setUnit] = useState(initial?.unit ?? "marta");
  const [icon, setIcon] = useState(initial?.icon ?? "target");
  const [color, setColor] = useState(initial?.color ?? "violet");
  const [category, setCategory] = useState(initial?.category ?? "Boshqa");
  const [trigger, setTrigger] = useState(initial?.trigger ?? "");
  const [stackAfter, setStackAfter] = useState(initial?.stackAfter ?? "");
  const [days, setDays] = useState(initial?.days ?? WEEKDAYS.map((d) => d.key));
  const [reminderTime, setReminderTime] = useState(initial?.reminderTime ?? "");

  const isValid = name.trim().length > 0 && days.length > 0;

  const toggleDay = (key) => {
    setDays((prev) =>
      prev.includes(key) ? prev.filter((d) => d !== key) : [...prev, key]
    );
  };

  const handleSubmit = () => {
    if (!isValid) return;
    onSave({
      id: initial?.id ?? Date.now().toString(),
      name,
      target: Number(target) || 1,
      unit,
      icon,
      color,
      category,
      trigger,
      stackAfter,
      days,
      reminderTime,
      current: initial?.current ?? 0,
    });
  };

  const ActiveIcon = ICONS[icon];
  const activeColor = COLORS[color];
  const inputClass = `w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-violet-500 ${t.input} ${t.strong}`;
  const labelClass = `text-xs mb-1.5 block ${t.sub}`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className={`w-full max-w-sm rounded-[24px] p-6 max-h-[90vh] overflow-y-auto no-scrollbar border ${t.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className={`text-base font-semibold ${t.strong}`}>
            {isEditing ? "Odatni tahrirlash" : "Yangi odat"}
          </h3>
          <button onClick={onClose} className={`${t.muted} hover:opacity-70`}>
            <X size={18} />
          </button>
        </div>

        {/* LIVE PREVIEW */}
        <div className={`flex items-center gap-3 rounded-2xl border p-3 mb-5 ${t.track} ${t.border}`}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: activeColor.soft }}
          >
            <ActiveIcon size={18} style={{ color: activeColor.ring }} />
          </div>
          <div className="min-w-0">
            <p className={`text-sm font-medium truncate ${t.strong}`}>
              {name || "Odat nomi shu yerda ko'rinadi"}
            </p>
            <p className={`text-[11px] ${t.muted}`}>
              Maqsad: {target || 1} {unit}
            </p>
          </div>
        </div>

        <label className={labelClass}>Odat nomi</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Masalan: Kitob o'qish"
          className={`${inputClass} mb-4`}
        />

        <label className={labelClass}>
          Qachon va qayerda bajarasiz? <span className={t.muted}>(ixtiyoriy, lekin tavsiya etiladi)</span>
        </label>
        <input
          value={trigger}
          onChange={(e) => setTrigger(e.target.value)}
          placeholder="Masalan: Ertalab nonushtadan keyin, oshxonada"
          className={`${inputClass} mb-1`}
        />
        <p className={`text-[10px] mb-4 ${t.muted}`}>
          💡 Aniq vaqt/joy belgilash odatni bajarish ehtimolini sezilarli oshiradi
        </p>

        <label className={labelClass}>
          Qaysi odatdan keyin? <span className={t.muted}>(ixtiyoriy)</span>
        </label>
        <input
          value={stackAfter}
          onChange={(e) => setStackAfter(e.target.value)}
          placeholder="Masalan: Tishimni yuvgandan keyin"
          className={`${inputClass} mb-4`}
        />

        <label className={labelClass}>
          Eslatma vaqti <span className={t.muted}>(ixtiyoriy)</span>
        </label>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className={`${inputClass} mb-4`}
        />

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className={labelClass}>Maqsad</label>
            <input
              type="number"
              min={1}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>O'lchov</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <label className={labelClass}>Qaysi kunlari?</label>
        <div className="flex gap-1.5 mb-1">
          {WEEKDAYS.map((d) => (
            <button
              key={d.key}
              onClick={() => toggleDay(d.key)}
              className={`flex-1 text-[11px] rounded-lg py-2 border transition-colors ${
                days.includes(d.key)
                  ? "border-violet-500 bg-violet-500/20 text-violet-300"
                  : t.chipInactive
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
        {days.length === 0 && (
          <p className="text-[10px] text-rose-400 mb-4">Kamida bitta kun tanlang</p>
        )}
        {days.length > 0 && <div className="mb-4" />}

        <label className={labelClass}>Kategoriya</label>
        <div className="flex flex-wrap gap-2 mb-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`text-xs rounded-full border px-3 py-1.5 ${
                category === cat
                  ? "border-violet-500 bg-violet-500/20 text-violet-300"
                  : t.chipInactive
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <label className={labelClass}>Ikonka</label>
        <div className="flex gap-2 mb-4 flex-wrap">
          {Object.entries(ICONS).map(([key, Icon]) => (
            <button
              key={key}
              onClick={() => setIcon(key)}
              className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                icon === key
                  ? "border-violet-500 bg-violet-500/20 text-violet-300"
                  : t.chipInactive
              }`}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>

        <label className={labelClass}>Rang</label>
        <div className="flex gap-2 mb-6">
          {Object.entries(COLORS).map(([key, c]) => (
            <button
              key={key}
              onClick={() => setColor(key)}
              className="w-8 h-8 rounded-full border-2"
              style={{
                background: c.ring,
                borderColor: color === key ? (t === THEME.light ? "#0f172a" : "#fff") : "transparent",
              }}
            />
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white text-sm font-semibold py-3 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {isEditing ? "Saqlash" : "Odatni qo'shish"}
        </button>
      </div>
    </div>
  );
}

export default AddHabitModal;