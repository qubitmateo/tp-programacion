"use client";

import { useState } from "react";
import { Car } from "@/lib/carUtils";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import { es } from "date-fns/locale/es";
import "react-datepicker/dist/react-datepicker.css";
import { PriceDisplay } from "./PriceDisplay";
import { motion } from "framer-motion";

registerLocale("es", es);

interface CarCardProps {
  car: Car;
  isAdmin: boolean;
  onRent: (id: string, startDate: Date, endDate: Date) => void;
  onDelete: (id: string) => void;
  onEdit: (car: Car) => void;
  onDeleteRent: (id: string) => void;
}

export function CarCard({
  car,
  isAdmin,
  onRent,
  onDelete,
  onEdit,
  onDeleteRent,
}: CarCardProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Evitar errores por horas

  const [startDate, setStartDate] = useState<Date>(car.rentDate || today);
  const [endDate, setEndDate] = useState<Date>(car.endDate || today);

  const isRented = !!car.rentedBy;

  // Calcular cantidad de días (INCLUSIVO)
  const diffInMs = endDate.getTime() - startDate.getTime();
  const days = Math.max(1, Math.ceil(diffInMs / (1000 * 60 * 60 * 24)) + 1);

  // Validar fechas (permitir hoy, pero no pasadas)
  const invalidDates =
    !startDate ||
    !endDate ||
    startDate > endDate ||
    startDate < today ||
    endDate < today;

  // Calcular precio total
  const totalPrice = car.dailyRate * days;

  // Formatear fechas a DD/MM/YYYY
  const formatDate = (date: Date | undefined) => {
    if (!date) return "";
    return date.toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="bg-gray-900 border border-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col w-[260px] hover:border-cyan-400 transition"
    >
      <div className="overflow-hidden">
        <img
          src={car.imageUrl}
          alt={car.model}
          className="h-48 w-full object-cover rounded-t-lg transition-transform duration-200 hover:scale-105"
        />
      </div>

      <div className="p-3 flex flex-col gap-1 flex-1">
        <h3 className="font-bold text-lg">{car.model}</h3>
        <p className="text-gray-400 text-sm">Precio diario: ${car.dailyRate}</p>

        {isRented ? (
          <div className="text-red-400 text-xs">
            Reservado por {car.renterUsername} <br />
            {formatDate(car.rentDate)} → {formatDate(car.endDate)}
          </div>
        ) : (
          !isAdmin && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="flex gap-1">
                <ReactDatePicker
                  selected={startDate}
                  onChange={(date: Date | null) => date && setStartDate(date)}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="bg-gray-800 text-white p-1 rounded w-[100px] text-sm"
                  minDate={today} // permitir hoy
                />
                <ReactDatePicker
                  selected={endDate}
                  onChange={(date: Date | null) => date && setEndDate(date)}
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  className="bg-gray-800 text-white p-1 rounded w-[100px] text-sm"
                  minDate={startDate}
                />
              </div>

              <PriceDisplay total={totalPrice} />

              <button
                onClick={() => onRent(car.id, startDate, endDate)}
                disabled={invalidDates}
                className={`mt-1 font-bold py-1 rounded transition text-sm ${
                  invalidDates
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600 text-black"
                }`}
              >
                Reservar
              </button>

              {invalidDates && (
                <p className="text-red-400 text-xs mt-1">Fechas inválidas</p>
              )}
            </div>
          )
        )}

        {isAdmin && (
          <div className="mt-auto flex gap-1 justify-end">
            <button
              onClick={() => onEdit(car)}
              className="bg-emerald-500 hover:bg-emerald-600 text-black py-1 px-2 rounded text-sm"
            >
              Editar
            </button>
            {isRented ? (
              <button
                onClick={() => onDeleteRent(car.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
              >
                Cancelar reserva
              </button>
            ) : (
              <button
                onClick={() => onDelete(car.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded text-sm"
              >
                Eliminar
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
