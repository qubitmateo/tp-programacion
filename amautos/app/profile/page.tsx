"use client";
import { useAuth } from "@/hooks/useAuth";
import { logout } from "@/lib/firebaseAuth";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (!user) return <p>No estás logueado.</p>;

  return (
    <div>
      <h1>Perfil</h1>
      <p>Email: {user.email}</p>
      <button onClick={() => logout()}>Cerrar sesión</button>
    </div>
  );
}

