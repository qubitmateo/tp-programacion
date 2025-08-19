"use client";
import { useState } from "react";
import { register } from "@/lib/firebaseAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await register(email, password);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-200">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
  className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-md flex flex-col gap-6 text-black"
      >
  <h1 className="text-3xl font-bold text-blue-900 mb-2 text-center">Registro</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black placeholder-gray-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition text-black placeholder-gray-500"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Registrarse
        </button>
        {error && <p className="text-red-600 text-center">{error}</p>}
        <p className="text-center">
          ¿Ya tenés cuenta?{' '}
          <Link href="/login" className="text-blue-600 underline hover:text-blue-800 transition">
            Entrá acá
          </Link>
        </p>
      </motion.form>
    </main>
  );
}

