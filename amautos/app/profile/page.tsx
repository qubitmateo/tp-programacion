"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  Car,
  getCars,
  getUserBookings,
  addCar,
  updateCar,
  deleteCar,
  rentCar,
  deleteRent,
} from "@/lib/carUtils";
import { getUserData, getUserAdmin } from "@/lib/userUtils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [cars, setCars] = useState<Car[]>([]);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dailyRate, setDailyRate] = useState<number>(0);

  // -----------------------------
  // Carga inicial
  // -----------------------------
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }

    if (user) {
      setProfileLoaded(true);

      // Cargar datos del usuario
      getUserData(user.uid).then((data) => setUserData(data));

      getUserAdmin(user.uid).then((admin) => setIsAdmin(admin));

      fetchCars();
      fetchUserCars();
    }
  }, [loading, user, router]);

  const fetchCars = async () => {
    setLoadingCars(true);
    const allCars = await getCars();
    setCars(allCars.filter((car) => !car.rentedBy));
    setLoadingCars(false);
  };

  const fetchUserCars = async () => {
    if (!user) return;
    const bookings = await getUserBookings(user.uid);
    setUserCars(bookings);
  };

  // -----------------------------
  // Logout
  // -----------------------------
  const handleLogout = async () => {
    const { logout } = await import("@/lib/firebaseAuth");
    await logout();
    router.push("/login");
  };

  // -----------------------------
  // Guardar auto
  // -----------------------------
  const saveCar = async () => {
    if (!model || !imageUrl || dailyRate <= 0) return;
    if (editingCar) {
      await updateCar(editingCar.id, model, imageUrl, dailyRate);
    } else {
      await addCar(model, imageUrl, dailyRate);
    }
    setShowDialog(false);
    setEditingCar(null);
    setModel("");
    setImageUrl("");
    setDailyRate(0);
    fetchCars();
    fetchUserCars();
  };

  // -----------------------------
  // Eliminar auto
  // -----------------------------
  const handleDeleteCar = async (id: string) => {
    if (confirm("¿Seguro que querés eliminar este auto?")) {
      await deleteCar(id);
      fetchCars();
      fetchUserCars();
    }
  };

  // -----------------------------
  // Eliminar alquiler
  // -----------------------------
  const handleDeleteRent = async (id: string) => {
    if (confirm("¿Seguro que querés eliminar este alquiler?")) {
      await deleteRent(id);
      fetchCars();
      fetchUserCars();
    }
  };

  if (!profileLoaded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-semibold text-cyan-300"
        >
          Cargando perfil...
        </motion.p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col text-white">
      {/* Top bar */}
      <nav className="w-full flex justify-between items-center px-8 py-4 bg-gray-950/70 backdrop-blur border-b border-gray-800 shadow-sm">
        <span className="text-2xl font-extrabold tracking-wide flex items-center gap-2 text-cyan-400">
          👤 Mi perfil
        </span>
        <div className="flex gap-3">
          <button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
          >
            Página principal
          </button>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {/* Información del usuario */}
      <section className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 drop-shadow">
          👋 Hola, {userData?.username || user?.email}!
        </h1>
        <p className="text-gray-300 mb-1">📧 {user?.email}</p>
        <p className="text-gray-400 text-sm">
          🗓 Registrado el:{" "}
          {userData?.createdAt.toLocaleDateString("es-AR", {
            weekday: "short",
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </p>

        <p className="text-gray-400 mb-4">
          🚗 Autos alquilados: {userCars.length}
        </p>
      </section>

      {/* Autos alquilados */}
      <section className="w-full max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">
          🚗 Mis autos alquilados
        </h2>
        {userCars.length === 0 ? (
          <p className="text-gray-400">
            No tenés autos alquilados actualmente.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.map((car) => (
              <div
                key={car.id}
                className="bg-gray-900/70 border border-gray-800 rounded-xl shadow p-4 flex flex-col gap-2 hover:border-cyan-400 transition"
              >
                <img
                  src={car.imageUrl}
                  alt={car.model}
                  className="w-full h-40 object-cover rounded-lg"
                />
                <h3 className="font-bold text-lg">{car.model}</h3>
                <p className="text-gray-400">Precio diario: ${car.dailyRate}</p>
                <p className="text-gray-400">
                  Desde: {car.rentDate?.toLocaleDateString()}
                </p>
                <p className="text-gray-400">
                  Hasta: {car.endDate?.toLocaleDateString()}
                </p>
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteRent(car.id)}
                    className="mt-2 bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                  >
                    Eliminar alquiler
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal agregar/editar auto */}
      {showDialog && (
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

            {/* Texto y input de precio */}
            <label className="text-gray-300 font-semibold flex items-center gap-2">
              💰 Precio por día
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
                onClick={saveCar}
                className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-black font-semibold py-2 px-4 rounded-lg transition"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                  setEditingCar(null);
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
