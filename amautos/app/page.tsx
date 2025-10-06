"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/lib/carUtils";
import { TopBar } from "@/components/TopBar";
import { CarCard } from "@/components/CarCard";
import { CarModal } from "@/components/CarModal";

export default function CarsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const {
    cars,
    loading: loadingCars,
    refreshCars,
    addCar,
    updateCar,
    deleteCar,
    rentCar,
    deleteRent,
  } = useCars();

  const [isAdmin, setIsAdmin] = useState(false);
  const [showRentedOnly, setShowRentedOnly] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Load admin state
  useEffect(() => {
    if (!loading && !user) router.replace("/register");
    if (user) {
      import("@/lib/userUtils").then(async ({ getUserAdmin }) => {
        const admin = await getUserAdmin(user.uid);
        setIsAdmin(admin);
      });
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    const { logout } = await import("@/lib/firebaseAuth");
    await logout();
    router.push("/login");
  };

  const handleSaveCar = async (
    model: string,
    imageUrl: string,
    dailyRate: number,
    editingCar?: Car | null,
  ) => {
    if (!model || !imageUrl || dailyRate <= 0) return;
    if (editingCar) await updateCar(editingCar.id, model, imageUrl, dailyRate);
    else await addCar(model, imageUrl, dailyRate);
    setShowDialog(false);
    setEditingCar(null);
  };

  if (loading)
    return <p className="text-center text-white mt-20">Cargando...</p>;
  if (!user) return null;

  const displayedCars = showRentedOnly ? cars.filter((c) => c.rentedBy) : cars;

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col text-white">
      <TopBar
        isAdmin={isAdmin}
        onAddCar={() => {
          setEditingCar(null);
          setShowDialog(true);
        }}
        onLogout={handleLogout}
      />

      <section className="flex flex-col items-center justify-center flex-1 py-10 px-4">
        <div className="w-full max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400 flex items-center gap-2">
            🔑 Autos disponibles
            {isAdmin && (
              <button
                onClick={() => setShowRentedOnly((prev) => !prev)}
                className={`ml-4 px-3 py-1 rounded-lg text-sm font-semibold transition ${
                  showRentedOnly
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                } flex items-center gap-1`}
              >
                🔍 {showRentedOnly ? "Ver todos" : "Ver alquilados"}
              </button>
            )}
          </h2>

          {loadingCars ? (
            <p className="text-gray-400">Cargando autos...</p>
          ) : displayedCars.length === 0 ? (
            <p className="text-gray-400">No hay autos para mostrar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {displayedCars.map((car) => (
                <CarCard
                  key={car.id}
                  car={car}
                  isAdmin={isAdmin}
                  onRent={(id, days) =>
                    rentCar(id, user.uid, days, user.email || undefined)
                  }
                  onDelete={deleteCar}
                  onEdit={(car) => {
                    setEditingCar(car);
                    setShowDialog(true);
                  }}
                  onDeleteRent={deleteRent}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <CarModal
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onSave={handleSaveCar}
        editingCar={editingCar}
      />
    </main>
  );
}
