"use client";

import { useState } from "react";
import { login } from "@/lib/firebaseAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      router.push("/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl shadow-xl p-10 w-full max-w-md flex flex-col gap-6"
      >
        <h1 className="text-3xl font-extrabold text-cyan-400 text-center mb-2">
          Iniciar sesión
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="px-4 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90 text-white font-semibold py-3 rounded-lg transition"
        >
          Entrar
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <p className="text-center text-gray-300">
          ¿No tenés cuenta?{" "}
          <Link
            href="/register"
            className="text-cyan-400 hover:text-cyan-300 underline transition"
          >
            Registrate acá
          </Link>
        </p>
      </motion.form>
    </main>
  );
}
