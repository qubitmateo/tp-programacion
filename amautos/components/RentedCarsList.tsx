"use client";

import { Car } from "@/lib/carUtils";

interface RentedCarsListProps {
  cars: Car[];
  isAdmin: boolean;
  onDeleteRent: (id: string) => void;
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cars.map((car) => (
        <div
          key={car.id}
          className="bg-gray-900/70 border border-gray-800 rounded-xl shadow p-4 flex flex-col gap-2 hover:border-cyan-400 transition"
        >
          <img
            src={car.imageUrl}
            alt={car.model}
            className="w-full h-40 object-cover rounded-lg"
          />
          <h3 className="font-bold text-lg text-cyan-300">{car.model}</h3>
          <p className="text-gray-400">💰 ${car.dailyRate}/día</p>
          <p className="text-gray-400">
            📅 Desde: {car.rentDate?.toLocaleDateString()}
          </p>
          <p className="text-gray-400">
            🏁 Hasta: {car.endDate?.toLocaleDateString()}
          </p>

          <button
            onClick={() => handleCancelRent(car.id, car.model)}
            className="mt-3 bg-gradient-to-r from-red-600 to-pink-700 hover:opacity-90 text-white font-semibold py-2 rounded-lg transition text-sm"
          >
            Cancelar alquiler
          </button>
        </div>
      ))}
    </div>
  );
}
