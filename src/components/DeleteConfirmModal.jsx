import { AlertTriangle } from "lucide-react";
import { THEME } from "../lib/theme";

function DeleteConfirmModal({ habitName, onCancel, onConfirm, t = THEME.dark }) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4" onClick={onCancel}>
      <div
        className={`w-full max-w-xs rounded-[24px] p-6 text-center border ${t.card}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-rose-500/15 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={22} className="text-rose-400" />
        </div>
        <h3 className={`text-sm font-semibold mb-1 ${t.strong}`}>Odatni o'chirasizmi?</h3>
        <p className={`text-xs mb-6 ${t.muted}`}>
          "{habitName}" va uning butun tarixi butunlay o'chib ketadi. Bu amalni orqaga qaytarib bo'lmaydi.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className={`flex-1 rounded-xl text-sm font-medium py-2.5 ${t.track} ${t.strong} ${t.hover}`}
          >
            Bekor qilish
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-rose-500 text-white text-sm font-medium py-2.5 hover:bg-rose-600"
          >
            O'chirish
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;