import { COLORS } from "../lib/constants";
import { BarChart3 } from "lucide-react";

const todayStr = () => new Date().toISOString().slice(0, 10);

function StatsView({ habits, history, t }) {
  const last14 = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);

    let score;
    if (key === todayStr()) {
      score = habits.length
        ? Math.round(
            (habits.reduce((sum, h) => sum + Math.min(1, h.current / h.target), 0) /
              habits.length) * 100
          )
        : 0;
    } else {
      const snap = history[key];
      if (!snap) {
        score = null;
      } else {
        const ids = Object.keys(snap);
        const relevant = habits.filter((h) => ids.includes(h.id));
        score = relevant.length
          ? Math.round(
              (relevant.reduce((sum, h) => sum + Math.min(1, snap[h.id] / h.target), 0) /
                relevant.length) * 100
            )
          : null;
      }
    }
    last14.push({ key, label: d.getDate(), score });
  }

  const perHabitRate = habits
    .map((h) => {
      const dates = Object.keys(history).slice(-14);
      let done = 0;
      let total = 0;
      dates.forEach((date) => {
        const val = history[date]?.[h.id];
        if (val !== undefined) {
          total++;
          if (val >= h.target) done++;
        }
      });
      if (h.current > 0 || total === 0) {
        total++;
        if (h.current >= h.target) done++;
      }
      return { ...h, rate: total ? Math.round((done / total) * 100) : 0 };
    })
    .sort((a, b) => b.rate - a.rate);

  const best = perHabitRate[0];
  const worst = perHabitRate[perHabitRate.length - 1];

  const validDays = last14.filter((d) => d.score !== null);
  const avgScore = validDays.length
    ? Math.round(validDays.reduce((sum, d) => sum + d.score, 0) / validDays.length)
    : 0;

  return (
    <div className="space-y-6 max-w-md">
      <div className={`rounded-[24px] border p-5 ${t.card}`}>
        <h3 className={`text-sm font-semibold mb-4 flex items-center gap-2 ${t.strong}`}>
          <BarChart3 size={15} className="text-violet-400" /> Oxirgi 14 kun
        </h3>
        <div className="flex items-end gap-1 h-24 overflow-x-auto">
          {last14.map((d) => (
            <div key={d.key} className="flex-1 min-w-[16px] flex flex-col items-center gap-1">
              <div className={`w-full h-16 rounded-md flex items-end overflow-hidden ${t.track}`}>
                <div
                  className="w-full rounded-md bg-gradient-to-t from-[#5A2EE6] to-[#7C4DFF]"
                  style={{
                    height: d.score === null ? "2px" : `${Math.max(6, d.score)}%`,
                    transition: "height 0.5s ease-out",
                  }}
                />
              </div>
              <span className={`text-[9px] ${t.muted}`}>{d.label}</span>
            </div>
          ))}
        </div>
        <p className={`text-xs mt-3 ${t.sub}`}>
          O'rtacha ball: <span className={`font-semibold ${t.strong}`}>{avgScore}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {best && (
          <div className={`rounded-[24px] border p-4 ${t.card}`}>
            <p className={`text-[11px] mb-1 ${t.muted}`}>Eng yaxshi odat</p>
            <p className={`text-sm font-semibold truncate ${t.strong}`}>{best.name}</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{best.rate}%</p>
          </div>
        )}
        {worst && (
          <div className={`rounded-[24px] border p-4 ${t.card}`}>
            <p className={`text-[11px] mb-1 ${t.muted}`}>E'tibor talab qiladi</p>
            <p className={`text-sm font-semibold truncate ${t.strong}`}>{worst.name}</p>
            <p className="text-2xl font-bold text-rose-400 mt-1">{worst.rate}%</p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className={`text-sm font-semibold ${t.strong}`}>Odatlar bo'yicha bajarilish</h3>
        {perHabitRate.map((h) => {
          const color = COLORS[h.color];
          return (
            <div key={h.id} className={`rounded-2xl border p-3 flex items-center gap-3 ${t.card}`}>
              <span className={`text-xs flex-1 truncate ${t.strong}`}>{h.name}</span>
              <div className={`w-24 h-1.5 rounded-full overflow-hidden ${t.track}`}>
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${color.bar}`}
                  style={{ width: `${h.rate}%` }}
                />
              </div>
              <span className={`text-xs w-9 text-right ${t.sub}`}>{h.rate}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StatsView;