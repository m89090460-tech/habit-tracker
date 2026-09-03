const todayStr = () => new Date().toISOString().slice(0, 10);

/* Berilgan odat uchun oxirgi 2 kun (bugundan oldin) ketma-ket o'tkazib
   yuborilganmi — shuni tekshiradi. Natija: true bo'lsa, "zanjir xavfda". */
export function isChainBroken(habit, history) {
  let missedInRow = 0;
  for (let i = 1; i <= 2; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    const snap = history[key];
    const value = snap ? snap[habit.id] : undefined;
    if (value === undefined) continue; // odat hali yaratilmagan bo'lgan kun — hisobga olinmaydi
    if (value < habit.target) missedInRow++;
    else break;
  }
  return missedInRow >= 2;
}