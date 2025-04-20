import { motion } from "framer-motion";

export default function PageBadge() {
  return (
    <div className="inline-flex items-center justify-center mb-6">
      <motion.span
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="inline-flex items-center rounded-full bg-gradient-to-r from-saffron-100 to-saffron-200 px-6 py-2 text-sm font-medium text-saffron-800 ring-1 ring-inset ring-saffron-500/30 shadow-sm"
      >
        Become Ngyungne Volunteer
      </motion.span>
    </div>
  );
}
