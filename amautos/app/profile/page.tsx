"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import {
  getCars,
  getUserBookings,
  addCar,
  updateCar,
  deleteCar,
  rentCar,
  Car
} from "@/lib/carUtils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const [profileLoaded, setProfileLoaded] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [userCars, setUserCars] = useState<Car[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [dailyRate, setDailyRate] = useState<number>(0);

  const [daysToRent, setDaysToRent] = useState(1);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace("/login");
      } else {
        setProfileLoaded(true);

        import("@/lib/userUtils").then(async ({ getUserAdmin }) => {
          const admin = await getUserAdmin(user.uid);
          setIsAdmin(admin);
        });

        fetchCars();
        fetchUserCars();
      }
    }
  }, [loading, user, router]);

  const fetchCars = async () => {
    setLoadingCars(true);
    const allCars = await getCars();
    setCars(allCars.filter(car => !car.rentedBy));
    setLoadingCars(false);
  };

  const fetchUserCars = async () => {
    if (!user) return;
    const bookings = await getUserBookings(user.uid);
    setUserCars(bookings);
  };

  const handleSaveCar = async () => {
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
    await fetchCars();
    await fetchUserCars();
  };

  const handleDeleteCar = async (id: string) => {
    if (confirm("¿Seguro que querés eliminar este auto?")) {
      await deleteCar(id);
      await fetchCars();
      await fetchUserCars();
    }
  };

  const handleRentCar = async (carId: string) => {
    if (!user) return;
    await rentCar(carId, user.uid, daysToRent);
    await fetchCars();
    await fetchUserCars();
    setDaysToRent(1);
  };

  const handleLogout = async () => {
    const { logout } = await import("@/lib/firebaseAuth");
    await logout();
    router.push("/login");
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
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white font-bold py-2 px-5 rounded-lg transition shadow"
        >
          Cerrar sesión
        </button>
      </nav>

      {/* User info */}
      <section className="flex flex-col items-center justify-center py-10 px-4">
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 drop-shadow">
          ¡Bienvenido!
        </h1>
        <p className="text-gray-300">{user?.email}</p>
      </section>

      <section className="w-full max-w-5xl mx-auto px-4 pb-12">
        {/* Mis autos */}
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">
          🚗 Mis autos alquilados
        </h2>
        {userCars.length === 0 ? (
          <p className="text-gray-400">No tenés autos alquilados actualmente.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userCars.map(car => (
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
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

