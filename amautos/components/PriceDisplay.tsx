"use client";

import { motion } from "framer-motion";

interface PriceDisplayProps {
  total: number;
}

export function PriceDisplay({ total }: PriceDisplayProps) {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0.8 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className="font-bold text-sm px-2 py-1 rounded bg-green-500 text-white w-fit"
    >
      💰 ${total}
    </motion.div>
  );
}
