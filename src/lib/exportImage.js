export function exportScoreCard({ todayScore, streak, habits, completedCount }) {
  const canvas = document.createElement("canvas");
  canvas.width = 480;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");

  const bgGrad = ctx.createLinearGradient(0, 0, 480, 640);
  bgGrad.addColorStop(0, "#0f172a");
  bgGrad.addColorStop(1, "#1e1033");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 480, 640);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px sans-serif";
  const dateStr = new Date().toLocaleDateString("uz-UZ", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  ctx.fillText(dateStr, 32, 50);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("Mening Score Card'im", 32, 84);

  const cx = 240;
  const cy = 210;
  const r = 80;

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + (todayScore / 100) * Math.PI * 2);
  const ringGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  ringGrad.addColorStop(0, "#7C4DFF");
  ringGrad.addColorStop(1, "#5A2EE6");
  ctx.strokeStyle = ringGrad;
  ctx.lineWidth = 14;
  ctx.lineCap = "round";
  ctx.stroke();

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 42px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(String(todayScore), cx, cy + 12);
  ctx.font = "11px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("BALL", cx, cy + 32);
  ctx.textAlign = "left";

  ctx.fillStyle = "#f59e0b";
  ctx.font = "bold 15px sans-serif";
  ctx.fillText(`Streak: ${streak} kun`, 32, 330);
  ctx.fillStyle = "#94a3b8";
  ctx.font = "13px sans-serif";
  ctx.fillText(`${completedCount}/${habits.length} odat bajarildi`, 32, 352);

  let y = 400;
  habits.forEach((h) => {
    const done = h.current >= h.target;
    ctx.fillStyle = done ? "#34D399" : "#475569";
    ctx.beginPath();
    ctx.arc(42, y - 5, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#e2e8f0";
    ctx.font = "14px sans-serif";
    ctx.fillText(`${h.name} — ${h.current}/${h.target}`, 60, y);
    y += 32;
  });

  ctx.fillStyle = "#475569";
  ctx.font = "11px sans-serif";
  ctx.fillText("Habit Tracker", 32, 610);

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `score-card-${new Date().toISOString().slice(0, 10)}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });
}