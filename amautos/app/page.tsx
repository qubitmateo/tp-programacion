"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Car } from "@/lib/carUtils";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [isAdmin, setIsAdmin] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dailyRate, setDailyRate] = useState<number>(0);
  const [cars, setCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);
  const [bookingCar, setBookingCar] = useState<Car | null>(null);
  const [daysToRent, setDaysToRent] = useState<number>(1);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [showRentedOnly, setShowRentedOnly] = useState(false);

  // -----------------------------
  // Carga inicial
  // -----------------------------
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register");
    }
    if (user) {
      import("@/lib/userUtils").then(async ({ getUserAdmin }) => {
        const admin = await getUserAdmin(user.uid);
        setIsAdmin(admin);
      });
      refreshCars();
    }
  }, [loading, user, router]);

  const refreshCars = async () => {
    import("@/lib/carUtils").then(async ({ getCars }) => {
      setLoadingCars(true);
      const carsList = await getCars();
      setCars(carsList);
      setLoadingCars(false);
    });
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
    const { addCar, updateCar } = await import("@/lib/carUtils");
    if (editingCar) {
      await updateCar(editingCar.id, model, imageUrl, dailyRate);
    } else {
      await addCar(model, imageUrl, dailyRate);
    }
    setShowDialog(false);
    setModel("");
    setImageUrl("");
    setDailyRate(0);
    setEditingCar(null);
    refreshCars();
  };

  // -----------------------------
  // Eliminar auto
  // -----------------------------
  const deleteCar = async (carId: string) => {
    const { deleteCar } = await import("@/lib/carUtils");
    await deleteCar(carId);
    refreshCars();
  };

  // -----------------------------
  // Reservar auto
  // -----------------------------
  const rentCar = async (carId: string) => {
    if (!user) return;
    const { rentCar } = await import("@/lib/carUtils");
    await rentCar(carId, user.uid, daysToRent);
    setBookingCar(null);
    alert("¡Reserva confirmada!");
    refreshCars();
  };

  // -----------------------------
  // Eliminar alquiler
  // -----------------------------
  const deleteRent = async (carId: string) => {
    if (!confirm("¿Seguro que querés eliminar este alquiler?")) return;
    const { deleteRent } = await import("@/lib/carUtils");
    await deleteRent(carId);
    refreshCars();
  };

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6">
            <span className="relative flex h-16 w-16">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-16 w-16 bg-cyan-500"></span>
            </span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl font-semibold text-cyan-300"
          >
            Cargando...
          </motion.p>
        </motion.div>
      </main>
    );
  }

  if (!user) return null;

  // Filtrar autos alquilados si está activo el modo “ver alquilados”
  const displayedCars = showRentedOnly
    ? cars.filter((c) => c.rentedBy)
    : cars;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col text-white">
      {/* Top bar */}
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
            <>
              <button
                onClick={() => setShowRentedOnly((prev) => !prev)}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
              >
                {showRentedOnly ? "Ver todos" : "Ver alquilados"}
              </button>
              <button
                onClick={() => {
                  setEditingCar(null);
                  setShowDialog(true);
                }}
                className="bg-gradient-to-r from-emerald-400 to-cyan-500 hover:opacity-90 text-black font-bold py-2 px-5 rounded-lg transition shadow"
              >
                + Agregar auto
              </button>
            </>
          )}
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Lista de autos */}
      <section className="flex flex-col items-center justify-center flex-1 py-10 px-4">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
            {showRentedOnly ? "🚫 Autos alquilados" : "🔑 Autos disponibles"}
          </h2>

          {loadingCars ? (
            <p className="text-gray-400">Cargando autos...</p>
          ) : displayedCars.length === 0 ? (
            <p className="text-gray-400">No hay autos para mostrar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedCars.map((car) => (
                <div
                  key={car.id}
                  className="group bg-gray-900/60 border border-gray-800 rounded-2xl shadow-lg p-0 flex flex-col hover:border-cyan-400 transition overflow-hidden relative"
                >
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
                          ❌ Alquilado por: {car.renterEmail || car.rentedBy}
                        </span>
                        {isAdmin && (
                          <button
                            onClick={() => deleteRent(car.id)}
                            className="mt-2 bg-gradient-to-r from-red-500 to-pink-600 hover:opacity-90 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                          >
                            Eliminar alquiler
                          </button>
                        )}
                      </>
                    ) : (
                      <span className="text-green-400 text-sm">✅ Disponible</span>
                    )}

                    {isAdmin && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditingCar(car);
                            setModel(car.model);
                            setImageUrl(car.imageUrl);
                            setDailyRate(car.dailyRate);
                            setShowDialog(true);
                          }}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                        >
                          Editar
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm("¿Seguro que querés eliminar este auto?")) {
                              await deleteCar(car.id);
                            }
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}

                    {!isAdmin && !car.rentedBy && (
                      <div className="mt-4">
                        <input
                          type="number"
                          min={1}
                          value={daysToRent}
                          onChange={(e) => setDaysToRent(Number(e.target.value))}
                          className="w-full mb-2 px-2 py-1 rounded-lg text-black focus:outline-none"
                          placeholder="Días a alquilar"
                        />
                        <button
                          onClick={() => rentCar(car.id)}
                          className="bg-gradient-to-r from-pink-500 to-purple-500 hover:opacity-90 text-white font-bold py-2 px-4 rounded-lg transition shadow w-full"
                        >
                          Reservar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
            <input
              type="number"
              placeholder="Precio diario"
              value={dailyRate}
              onChange={(e) => setDailyRate(Number(e.target.value))}
              className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
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

