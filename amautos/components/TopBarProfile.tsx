"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

interface TopBarProps {
  onLogout?: () => void; // optional, can override
}

export function TopBarProfile({ onLogout }: TopBarProps) {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect automatically if logged out
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register"); // or "/login"
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      const { logout } = await import("@/lib/firebaseAuth");
      await logout();
    }
    router.replace("/register"); // immediately redirect
  };

  return (
    <nav className="w-full flex justify-between items-center px-8 py-4 bg-gray-950/70 backdrop-blur border-b border-gray-800 shadow-sm">
      <button
        onClick={() => router.push("/")}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-5 rounded-lg transition shadow"
      >
        Página principal
      </button>

      <div className="flex gap-3">
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-5 rounded-lg transition shadow"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
