"use client";

import { Car } from "@/lib/carUtils";
import { PriceDisplay } from "./PriceDisplay";
import { motion } from "framer-motion";

interface RentedCarsListProps {
  cars: Car[];
  isAdmin: boolean;
  onDeleteRent: (id: string) => void;
}

// 🧠 Helper para mostrar fecha como dd/MM/yyyy
function formatDate(date?: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function RentedCarsList({
  cars,
  isAdmin,
  onDeleteRent,
}: RentedCarsListProps) {
  if (!cars.length)
    return (
      <p className="text-gray-400 text-center mt-6">
        No tenés autos alquilados actualmente.
      </p>
    );

  const handleCancelRent = (id: string, model: string) => {
    const confirmed = window.confirm(
      `¿Estás seguro de que querés cancelar el alquiler del auto "${model}"?`,
    );
    if (confirmed) onDeleteRent(id);
  };

  const calculateDays = (start?: Date | null, end?: Date | null) => {
    if (!start || !end) return 1;
    const diff = end.getTime() - start.getTime();
    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => {
        const days = calculateDays(car.rentDate, car.endDate);
        const totalPrice = car.dailyRate * days;

        return (
          <motion.div
            key={car.id}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="bg-gray-900/70 border border-gray-800 rounded-xl shadow p-4 flex flex-col gap-2 hover:border-cyan-400 transition"
          >
            <div className="overflow-hidden">
              <img
                src={car.imageUrl}
                alt={car.model}
                className="w-full h-40 object-cover rounded-lg transition-transform duration-200 hover:scale-105"
              />
            </div>

            <h3 className="font-bold text-lg text-cyan-300">{car.model}</h3>

            <PriceDisplay total={totalPrice} />

            <p className="text-gray-400">
              📅 Desde: {formatDate(car.rentDate)}
            </p>
            <p className="text-gray-400">🏁 Hasta: {formatDate(car.endDate)}</p>

            <button
              onClick={() => handleCancelRent(car.id, car.model)}
              className="mt-3 bg-gradient-to-r from-red-600 to-pink-700 hover:opacity-90 text-white font-semibold py-2 rounded-lg transition text-sm"
            >
              Cancelar alquiler
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}
