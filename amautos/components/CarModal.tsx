"use client";

import { useState, useEffect } from "react";
import { Car } from "@/lib/carUtils";

interface CarModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (
    model: string,
    imageUrl: string,
    dailyRate: number,
    editingCar?: Car | null,
  ) => void;
  editingCar?: Car | null;
}

export function CarModal({ show, onClose, onSave, editingCar }: CarModalProps) {
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dailyRate, setDailyRate] = useState<number>(0);

  useEffect(() => {
    if (editingCar) {
      setModel(editingCar.model);
      setImageUrl(editingCar.imageUrl);
      setDailyRate(editingCar.dailyRate);
    } else {
      setModel("");
      setImageUrl("");
      setDailyRate(0);
    }
  }, [editingCar]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70 backdrop-blur">
      <div className="bg-gray-900/90 border border-gray-700 rounded-xl shadow-lg p-8 flex flex-col gap-4 w-full max-w-sm text-white">
        <h2 className="text-xl font-bold mb-2 text-cyan-400">
          {editingCar ? "Editar auto" : "Agregar auto"}
        </h2>

        <input
          type="text"
          placeholder="Modelo"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <input
          type="url"
          placeholder="URL de la imagen"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <label className="text-gray-300 font-semibold flex items-center gap-2">
          💰 Precio por día:
        </label>
        <input
          type="number"
          placeholder="Precio diario"
          value={dailyRate}
          onChange={(e) => setDailyRate(Number(e.target.value))}
          min={0}
          className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition appearance-none"
        />

        <div className="flex gap-2 mt-2">
          <button
            onClick={() => onSave(model, imageUrl, dailyRate, editingCar)}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black font-semibold py-2 px-4 rounded-lg transition"
          >
            Guardar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
