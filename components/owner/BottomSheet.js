import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MdClose } from "react-icons/md";

export default function BottomSheet({ isOpen, onClose, title, children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="backdrop"
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            key="sheet"
            className="safe-bottom max-h-[88vh] w-full max-w-md overflow-y-auto rounded-t-3xl border-t border-line bg-surface"
            style={{ willChange: "transform" }}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={
              shouldReduceMotion
                ? { duration: 0 }
                : { type: "spring", stiffness: 340, damping: 34 }
            }
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mx-auto mt-2.5 h-1 w-10 rounded-full bg-line" />
            <div className="flex items-center justify-between px-5 pb-2 pt-3">
              <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-canvas text-muted"
                aria-label="Close"
              >
                <MdClose size={18} />
              </button>
            </div>
            <div className="px-5 pb-8">{children}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
