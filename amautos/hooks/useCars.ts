"use client";

import { useState, useEffect } from "react";
import { Car } from "@/lib/carUtils";

export function useCars() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshCars = async () => {
    const { getCars } = await import("@/lib/carUtils");
    setLoading(true);
    const list = await getCars();
    setCars(list);
    setLoading(false);
  };

  const addCar = async (model: string, imageUrl: string, dailyRate: number) => {
    const { addCar } = await import("@/lib/carUtils");
    await addCar(model, imageUrl, dailyRate);
    refreshCars();
  };

  const updateCar = async (
    id: string,
    model: string,
    imageUrl: string,
    dailyRate: number,
  ) => {
    const { updateCar } = await import("@/lib/carUtils");
    await updateCar(id, model, imageUrl, dailyRate);
    refreshCars();
  };

  const deleteCar = async (id: string) => {
    const { deleteCar } = await import("@/lib/carUtils");
    await deleteCar(id);
    refreshCars();
  };

  const rentCar = async (
    carId: string,
    userId: string,
    days: number,
    email?: string,
  ) => {
    const { rentCar } = await import("@/lib/carUtils");
    await rentCar(carId, userId, days, email);
    refreshCars();
  };

  const deleteRent = async (carId: string) => {
    const { deleteRent } = await import("@/lib/carUtils");
    await deleteRent(carId);
    refreshCars();
  };

  useEffect(() => {
    refreshCars();
  }, []);

  return {
    cars,
    loading,
    refreshCars,
    addCar,
    updateCar,
    deleteCar,
    rentCar,
    deleteRent,
  };
}
