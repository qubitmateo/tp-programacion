"use client";

interface UserInfoProps {
  username?: string;
  email?: string;
  createdAt?: Date;
  rentedCount: number;
}

export function UserInfo({
  username,
  email,
  createdAt,
  rentedCount,
}: UserInfoProps) {
  return (
    <section className="flex flex-col items-center justify-center py-10 px-4">
      <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 mb-2 drop-shadow">
        👋 Hola, {username || email}!
      </h1>
      <p className="text-gray-300 mb-1">📧 {email}</p>
      <p className="text-gray-400 text-sm">
        🗓 Registrado el:{" "}
        {createdAt?.toLocaleDateString("es-AR", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
      <p className="text-gray-400 mb-4">🚗 Autos alquilados: {rentedCount}</p>
    </section>
  );
}
