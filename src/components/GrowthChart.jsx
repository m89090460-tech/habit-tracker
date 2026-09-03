function GrowthChart({ checkins, t }) {
  if (checkins.length === 0) {
    return (
      <div className={`text-center py-10 text-sm rounded-[24px] border border-dashed ${t.border} ${t.muted}`}>
        Hali kunlik sharhlar yo'q. Bugungi sharhni to'ldiring!
      </div>
    );
  }

  let cum = 1;
  const points = checkins.map((c) => {
    if (c.direction === 1) cum *= 1.01;
    else if (c.direction === -1) cum *= 0.99;
    return cum;
  });

  const max = Math.max(...points, 1);
  const min = Math.min(...points, 1);
  const range = max - min || 1;

  const W = 320, H = 140, PAD = 10;
  const stepX = points.length > 1 ? (W - PAD * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = PAD + i * stepX;
    const y = H - PAD - ((p - min) / range) * (H - PAD * 2);
    return `${x},${y}`;
  });

  const last = points[points.length - 1];
  const percentChange = Math.round((last - 1) * 100);
  const positive = percentChange >= 0;

  return (
    <div className={`rounded-[24px] border p-5 ${t.card}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className={`text-sm font-semibold ${t.strong}`}>1% qoidasi — o'sish egri chizig'i</h3>
        <span className={`text-sm font-bold ${positive ? "text-emerald-400" : "text-rose-400"}`}>
          {positive ? "+" : ""}{percentChange}%
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32">
        <polyline
          points={coords.join(" ")}
          fill="none"
          stroke="url(#growthGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="growthGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="100%" stopColor={positive ? "#34D399" : "#FB7185"} />
          </linearGradient>
        </defs>
      </svg>
      <p className={`text-xs mt-2 ${t.muted}`}>
        Har kuni 1% yaxshilansangiz — bir yilda taxminan 37 barobar o'sasiz (Atomic Habits qoidasi).
      </p>
    </div>
  );
}

export default GrowthChart;