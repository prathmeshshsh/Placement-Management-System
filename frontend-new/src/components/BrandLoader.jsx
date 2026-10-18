import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

export default function BrandLoader() {
  const [show, setShow] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(() => setShow(false), reduceMotion ? 650 : 2100);
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div className="brand-loader" role="status" aria-label="Loading Placement Management System"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)", transition: { duration: reduceMotion ? 0.2 : 0.8, ease: [0.76, 0, 0.24, 1] } }}>
          <div className="loader-topline"><span>PMS®</span><span>PLACEMENT MANAGEMENT SYSTEM</span></div>
          <div className="loader-center">
            <motion.div className="hourglass-mark" initial={{ opacity: 0, scale: 0.82, rotate: -18 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduceMotion ? 0.2 : 0.85, ease: [0.16, 1, 0.3, 1] }}>
              <svg viewBox="0 0 120 120" aria-hidden="true">
                <path d="M30 14 H90 L67 38 L60 45 L53 38 Z" />
                <path d="M30 106 H90 L67 82 L60 75 L53 82 Z" />
                <path d="M30 14 L90 74 M90 14 L30 74" className="hourglass-cross" />
              </svg>
            </motion.div>
            <motion.div className="loader-word" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.6 }}>A BETTER WAY FORWARD</motion.div>
            <div className="loader-loading"><span>LOADING</span><span className="loader-dots"><i /><i /><i /></span></div>
          </div>
          <div className="loader-bottomline"><span>STUDENTS · COMPANIES · OPPORTUNITY</span><div className="loader-progress"><motion.i initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: reduceMotion ? 0.4 : 1.8, ease: "easeInOut" }} /></div><span>EST. 2026</span></div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
