
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

export default function Page() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [model, setModel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/register");
    }
    if (user) {
      import("@/lib/userUtils").then(async ({ getUserAdmin }) => {
        const admin = await getUserAdmin(user.uid);
        setIsAdmin(admin);
      });
      import("@/lib/carUtils").then(async ({ getCars }) => {
        setLoadingCars(true);
        const carsList = await getCars();
        setCars(carsList);
        setLoadingCars(false);
      });
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center"
        >
          <div className="mb-6">
            <span className="relative flex h-16 w-16">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-16 w-16 bg-blue-500"></span>
            </span>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-2xl font-semibold text-blue-900"
          >
            Cargando...
          </motion.p>
        </motion.div>
      </main>
    );
  }

  if (user) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col">
        {/* Top bar */}
        <nav className="w-full flex justify-between items-center px-8 py-4 bg-yellow-100/80 shadow-sm">
          <span className="text-2xl font-extrabold text-yellow-700 tracking-tight flex items-center gap-2">
            <span role="img" aria-label="auto">🚗</span> Amautos
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/profile")}
              className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-2 px-5 rounded-lg transition shadow"
            >
              Mi perfil
            </button>
            <button
              onClick={async () => {
                const { logout } = await import("@/lib/firebaseAuth");
                await logout();
                router.push("/login");
              }}
              className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-2 px-5 rounded-lg transition shadow"
            >
              Salir
            </button>
          </div>
        </nav>

        {/* Hero section */}
        <section className="flex flex-col items-center justify-center flex-1 py-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-3xl text-center"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-700 mb-4 drop-shadow flex items-center justify-center gap-2">
              <span role="img" aria-label="auto">🚙</span> ¡Alquilá tu auto sin vueltas!
            </h1>
            <p className="text-lg md:text-xl text-yellow-900 mb-8">En Amautos, te llevás el auto que querés, sin trámites raros ni letra chica. Elegí, reservá y salí a la ruta. ¡Así de simple!</p>
            <div className="flex flex-col md:flex-row justify-center gap-6 mb-8">
              <div className="bg-yellow-50 rounded-xl shadow p-6 flex-1 min-w-[220px]">
                <h3 className="text-base font-bold text-yellow-700 mb-2 flex items-center gap-1"><span role="img" aria-label="auto">🛣️</span> Autos para todos</h3>
                <p className="text-yellow-800">¿Vas a la playa, a la montaña o a ver a la abuela? Tenemos un auto para vos.</p>
              </div>
              <div className="bg-yellow-50 rounded-xl shadow p-6 flex-1 min-w-[220px]">
                <h3 className="text-base font-bold text-yellow-700 mb-2 flex items-center gap-1"><span role="img" aria-label="online">📱</span> Reservá en 2 minutos</h3>
                <p className="text-yellow-800">Nada de papeles ni llamadas. Todo online, todo tranqui.</p>
              </div>
              <div className="bg-yellow-50 rounded-xl shadow p-6 flex-1 min-w-[220px]">
                <h3 className="text-base font-bold text-yellow-700 mb-2 flex items-center gap-1"><span role="img" aria-label="mate">🧉</span> Buena onda</h3>
                <p className="text-yellow-800">Te ayudamos en lo que necesites. ¡Y si pinta mate, también!</p>
              </div>
            </div>
            {isAdmin && (
              <button
                onClick={() => setShowDialog(true)}
                className="bg-green-400 hover:bg-green-500 text-green-900 font-bold py-3 px-8 rounded-lg transition text-lg mb-8 shadow"
              >
                + Agregar auto
              </button>
            )}
          </motion.div>

          {/* Dialogo para agregar auto */}
          {showDialog && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col gap-4 w-full max-w-sm">
                <h2 className="text-xl font-bold mb-2">Agregar auto</h2>
                <input
                  type="text"
                  placeholder="Modelo"
                  value={model}
                  onChange={e => setModel(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
                />
                <input
                  type="url"
                  placeholder="URL de la imagen"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black"
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={async () => {
                      if (!model || !imageUrl) return;
                      const { addCar } = await import("@/lib/carUtils");
                      await addCar(model, imageUrl);
                      setShowDialog(false);
                      setModel("");
                      setImageUrl("");
                      // Refresh car list
                      const { getCars } = await import("@/lib/carUtils");
                      setLoadingCars(true);
                      const carsList = await getCars();
                      setCars(carsList);
                      setLoadingCars(false);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setShowDialog(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded-lg transition"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Car list */}
          <div className="w-full max-w-5xl mt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-yellow-700 text-left flex items-center gap-2">
              <span role="img" aria-label="llave">🔑</span> Autos disponibles
            </h2>
            {loadingCars ? (
              <p className="text-yellow-700">Cargando autos...</p>
            ) : cars.length === 0 ? (
              <p className="text-yellow-700">Todavía no hay autos cargados. ¡Animate a ser el primero!</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {cars.map(car => (
                  <div key={car.id} className="bg-yellow-50 rounded-lg shadow p-4 flex flex-col items-center hover:shadow-lg transition border border-yellow-100">
                    <img src={car.imageUrl} alt={car.model} className="w-56 h-36 object-cover rounded mb-3 border border-yellow-200" />
                    <span className="font-bold text-lg text-yellow-800 mb-1">{car.model}</span>
                    <span className="text-yellow-700 text-sm">¡Listo para tu próxima aventura!</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    );
  }

  // If not authenticated, the useEffect will redirect
  return null;
}

