import { motion } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

function Toast({ message, onClose }) {
  if (!message) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-2 rounded-full bg-rose-500 text-white text-xs font-medium px-4 py-2 shadow-lg"
    >
      <AlertTriangle size={14} />
      {message}
      <button onClick={onClose} className="ml-1">
        <X size={13} />
      </button>
    </motion.div>
  );
}

export default Toast;