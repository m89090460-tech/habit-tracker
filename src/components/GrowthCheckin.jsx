import { useState } from "react";
import { motion } from "framer-motion";

const QUESTIONS = [
  "Bugun rejalashtirilgan odatlaringizning aksariyatini bajardingizmi?",
  "Qiyin bo'lsa ham, to'g'ri tanlovni qildingizmi?",
  "Ertangi \"men\"ga foyda keltiradigan ish qildingizmi?",
  "Bahonalar qidirmasdan, harakat qildingizmi?",
];

function GrowthCheckin({ todayScore, onClose, onSubmit, t }) {
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));

  const toggle = (i, value) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[i] = value;
      return next;
    });
  };

  const allAnswered = answers.every((a) => a !== null);
  const yesCount = answers.filter((a) => a === true).length;

  const direction = (() => {
    if (!allAnswered) return 0;
    const selfScore = yesCount / QUESTIONS.length;
    const combined = (selfScore + todayScore / 100) / 2;
    if (combined >= 0.6) return 1;
    if (combined <= 0.4) return -1;
    return 0;
  })();

  const handleSubmit = () => {
    if (!allAnswered) return;
    onSubmit({ answers, direction });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`w-full max-w-sm rounded-[24px] border p-6 max-h-[90vh] overflow-y-auto no-scrollbar ${t.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className={`text-base font-semibold mb-1 ${t.strong}`}>Bugungi sharh</h3>
        <p className={`text-xs mb-5 ${t.sub}`}>
          Har kun 1% yaxshi yoki 1% yomon bo'lishi mumkin — o'zingizga halol javob bering.
        </p>

        <div className="space-y-4 mb-6">
          {QUESTIONS.map((q, i) => (
            <div key={i}>
              <p className={`text-sm mb-2 ${t.strong}`}>{q}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => toggle(i, true)}
                  className={`flex-1 text-xs rounded-lg py-2 border transition-colors ${
                    answers[i] === true
                      ? "border-emerald-500 bg-emerald-500/20 text-emerald-300"
                      : t.chipInactive
                  }`}
                >
                  Ha
                </button>
                <button
                  onClick={() => toggle(i, false)}
                  className={`flex-1 text-xs rounded-lg py-2 border transition-colors ${
                    answers[i] === false
                      ? "border-rose-500 bg-rose-500/20 text-rose-300"
                      : t.chipInactive
                  }`}
                >
                  Yo'q
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full rounded-xl bg-gradient-to-r from-[#7C4DFF] to-[#5A2EE6] text-white text-sm font-semibold py-3 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Yakunlash
        </button>
      </motion.div>
    </div>
  );
}

export default GrowthCheckin;