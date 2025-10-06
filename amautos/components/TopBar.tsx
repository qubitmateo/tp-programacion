"use client";

import { useRouter } from "next/navigation";

interface TopBarProps {
  isAdmin: boolean;
  onAddCar: () => void;
  onLogout: () => void;
}

export function TopBar({ isAdmin, onAddCar, onLogout }: TopBarProps) {
  const router = useRouter();

  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-gray-950/70 backdrop-blur border-b border-gray-800 shadow-sm">
      <span className="text-2xl font-extrabold tracking-wide flex items-center gap-2 text-cyan-400">
        🚗 Amautos
      </span>

      <div className="flex gap-3">
        <button
          onClick={() => router.push("/profile")}
          className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
        >
          Mi perfil
        </button>

        {isAdmin && (
          <button
            onClick={onAddCar}
            className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 text-black font-bold py-2 px-5 rounded-lg transition shadow"
          >
            + Agregar auto
          </button>
        )}

        <button
          onClick={onLogout}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
        >
          Salir
        </button>
      </div>
    </nav>
  );
}
