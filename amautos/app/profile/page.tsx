
"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter();

  // Placeholder user data
  const user = {
    name: "Usuario Ejemplo",
    email: "usuario@email.com",
    avatar: "/globe.svg"
  };

  const handleLogout = () => {
    // Aquí deberías limpiar el estado de autenticación y redirigir
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col items-center gap-6 text-black"
      >
        <motion.img
          src={user.avatar}
          alt="Avatar"
          width={96}
          height={96}
          className="rounded-full border-4 border-blue-200 shadow mb-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        />
        <h1 className="text-3xl font-bold text-blue-900 text-center">¡Bienvenido, {user.name}!</h1>
        <p className="text-lg text-gray-700 text-center">{user.email}</p>
        <div className="flex flex-col gap-4 w-full mt-6">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Cerrar sesión
          </button>
          <button
            onClick={() => router.push("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition"
          >
            Volver al dashboard
          </button>
        </div>
      </motion.div>
    </main>
  );
}

