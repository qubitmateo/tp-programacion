"use client";

import { Car } from "@/lib/carUtils";
import { useState } from "react";

interface CarCardProps {
  car: Car;
  isAdmin: boolean;
  onRent: (carId: string, days: number) => void;
  onDelete: (carId: string) => void;
  onEdit: (car: Car) => void;
  onDeleteRent: (carId: string) => void;
}

export function CarCard({
  car,
  isAdmin,
  onRent,
  onDelete,
  onEdit,
  onDeleteRent,
}: CarCardProps) {
  const [days, setDays] = useState(1);

  return (
    <div className="group bg-gray-900/60 border border-gray-800 rounded-2xl shadow-lg flex flex-col hover:border-cyan-400 transition overflow-hidden">
      <div className="relative w-full h-44 overflow-hidden">
        <img
          src={car.imageUrl}
          alt={car.model}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <span className="absolute top-2 left-2 bg-black/70 text-cyan-300 text-xs font-bold px-2 py-1 rounded shadow">
          🚗 ${car.dailyRate}/día
        </span>
      </div>

      <div className="flex flex-col gap-1 p-4 flex-1">
        <span className="font-bold text-lg text-white mb-1 truncate">
          {car.model}
        </span>

        {car.rentedBy ? (
          <>
            <span className="text-red-400 text-sm">
              ❌ Alquilado por: {car.renterUsername || car.rentedBy}
            </span>
            {isAdmin && (
              <button
                onClick={() => onDeleteRent(car.id)}
                className="mt-2 bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
              >
                Eliminar alquiler
              </button>
            )}
          </>
        ) : (
          <span className="text-green-400 text-sm">✅ Disponible</span>
        )}

        {!isAdmin && !car.rentedBy && (
          <div className="mt-4 flex flex-col items-center gap-3">
            <label className="text-sm text-gray-300 font-medium">
              ¿Cuántos días querés rentar?
            </label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-28 text-center px-3 py-2 rounded-lg border border-cyan-500/40 bg-gray-800 text-cyan-200 font-semibold focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            />
            <button
              onClick={() => onRent(car.id, days)}
              className="bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition shadow w-full"
            >
              Confirmar reserva
            </button>
          </div>
        )}

        {isAdmin && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(car)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
            >
              Editar
            </button>
            <button
              onClick={() => {
                if (confirm("¿Seguro que querés eliminar este auto?")) {
                  onDelete(car.id);
                }
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
            >
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
