"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Car, getCars, getUserBookings } from "@/lib/carUtils";
import { getUserData, getUserAdmin } from "@/lib/userUtils";

import { TopBarProfile } from "@/components/TopBarProfile";
import { UserInfo } from "@/components/UserInfo";
import { RentedCarsList } from "@/components/RentedCarsList";
import { CarModal } from "@/components/CarModal";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const [userCars, setUserCars] = useState<Car[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  // Load user info & bookings
  useEffect(() => {
    if (user) {
      setProfileLoaded(true);
      getUserData(user.uid).then(setUserData);
      getUserAdmin(user.uid).then(setIsAdmin);
      getUserBookings(user.uid).then(setUserCars);
    }
  }, [user]);

  const handleLogout = async () => {
    const { logout } = await import("@/lib/firebaseAuth");
    await logout();
  };

  const handleDeleteRent = async (id: string) => {
    const { deleteRent } = await import("@/lib/carUtils");
    await deleteRent(id);
    setUserCars((prev) => prev.filter((c) => c.id !== id));
  };

  if (!profileLoaded)
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

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 flex flex-col text-white">
      <TopBarProfile onLogout={handleLogout} />
      <UserInfo
        username={userData?.username}
        email={user?.email ?? undefined}
        createdAt={userData?.createdAt}
        rentedCount={userCars.length}
      />
      <section className="w-full max-w-5xl mx-auto px-4 pb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-cyan-400">
          🚗 Mis autos alquilados
        </h2>
        <RentedCarsList
          cars={userCars}
          isAdmin={isAdmin}
          onDeleteRent={handleDeleteRent}
        />
      </section>

      {showDialog && (
        <CarModal
          show={showDialog}
          editingCar={editingCar}
          onClose={() => setShowDialog(false)}
          onSave={() => {}}
        />
      )}
    </main>
  );
}
