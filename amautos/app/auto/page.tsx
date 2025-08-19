import Image from "next/image";
import { motion } from "framer-motion";

export default function AutoPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-blue-100 flex flex-col items-center justify-center py-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full flex flex-col items-center"
      >
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl font-extrabold mb-6 text-blue-900 drop-shadow"
        >
          Toyota Corolla 2022
        </motion.h1>
        <motion.div whileHover={{ scale: 1.05 }} className="mb-6">
          <Image
            src="/corolla.webp"
            alt="Toyota Corolla"
            width={400}
            height={250}
            className="rounded-xl shadow-lg transition-transform duration-300"
          />
        </motion.div>
        <div className="max-w-md text-lg text-gray-800">
          <p className="font-semibold mb-2">Características:</p>
          <ul className="list-disc ml-6 mb-4">
            <li>Motor 1.8L</li>
            <li>Automático</li>
            <li>5 pasajeros</li>
            <li>Bluetooth, aire acondicionado</li>
          </ul>
          <p className="mb-2"><span className="font-semibold">Precio por día:</span> $25.000</p>
          <p className="mb-6 text-green-600 font-bold">Disponible para alquilar ahora mismo.</p>
        </div>
      </motion.div>
    </main>
  );
}