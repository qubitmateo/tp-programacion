"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useCars } from "@/hooks/useCars";
import { Car } from "@/lib/carUtils";
import { TopBar } from "@/components/TopBar";
import { CarCard } from "@/components/CarCard";
import { CarModal } from "@/components/CarModal";

type SortBy = "name" | "price" | null;

export default function CarsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const {
    cars,
    loading: loadingCars,
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
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>(null);

  useEffect(() => {
    if (!loading && !user) router.replace("/register");
    if (user) {
      import("@/lib/userUtils").then(async ({ getUserAdmin }) => {
        setIsAdmin(await getUserAdmin(user.uid));
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

  const displayedCars = useMemo(() => {
    if (!Array.isArray(cars)) return [];
    let filtered = cars.filter((car) => {
      const matchesSearch = car.model
        .toLowerCase()
        .includes(search.toLowerCase().trim());
      return showRentedOnly ? car.rentedBy && matchesSearch : matchesSearch;
    });

    if (sortBy === "name")
      filtered.sort((a, b) => a.model.localeCompare(b.model));
    else if (sortBy === "price")
      filtered.sort((a, b) => b.dailyRate - a.dailyRate);

    return filtered;
  }, [cars, showRentedOnly, search, sortBy]);

  if (loading)
    return <p className="text-center text-white mt-20">Cargando...</p>;
  if (!user) return null;

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
          <div className="flex justify-center mb-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="🔍 Buscar un auto..."
              className="w-full sm:w-2/3 lg:w-1/2 p-4 rounded-full bg-gray-800 text-white text-center text-lg focus:ring-2 focus:ring-cyan-400 outline-none shadow-md"
            />
          </div>

          <div className="flex items-center justify-center mb-8 gap-2">
            {isAdmin && (
              <button
                onClick={() => setShowRentedOnly((prev) => !prev)}
                className={`px-3 py-1 rounded-lg text-sm font-semibold transition ${showRentedOnly ? "bg-red-600 text-white hover:bg-red-700" : "bg-cyan-500 text-white hover:bg-cyan-600"} flex items-center gap-1`}
              >
                {showRentedOnly ? "Ver todos" : "Ver alquilados"}
              </button>
            )}

            <div className="relative">
              <button
                onClick={() =>
                  setSortBy(
                    sortBy === "name"
                      ? "price"
                      : sortBy === "price"
                        ? null
                        : "name",
                  )
                }
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white rounded-full transition flex items-center justify-center"
                title="Ordenar"
              >
                <svg
                  className={`w-4 h-4 transform transition-transform ${sortBy ? "rotate-90 text-cyan-400" : "text-white"}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
              {sortBy && (
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs text-white bg-gray-800 px-1 rounded">
                  {sortBy === "name" ? "A→Z" : "Precio"}
                </span>
              )}
            </div>
          </div>

          {loadingCars ? (
            <p className="text-gray-400">Cargando autos...</p>
          ) : displayedCars.length === 0 ? (
            <p className="text-gray-400">No hay autos para mostrar.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              <AnimatePresence>
                {displayedCars.map((car) => (
                  <motion.div
                    key={car.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.05 },
                      layout: { duration: 0.2 },
                    }}
                  >
                    <CarCard
                      car={car}
                      isAdmin={isAdmin}
                      onRent={(id, start, end) =>
                        rentCar(
                          id,
                          user.uid,
                          start,
                          end,
                          user.email || undefined,
                        )
                      }
                      onDelete={deleteCar}
                      onEdit={(car) => {
                        setEditingCar(car);
                        setShowDialog(true);
                      }}
                      onDeleteRent={deleteRent}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
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
