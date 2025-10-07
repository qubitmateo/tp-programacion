"use client";

import db from "./firestore";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export interface Car {
  id: string;
  model: string;
  imageUrl: string;
  dailyRate: number;
  rentedBy?: string | null;
  renterUsername?: string | null;
  rentDate?: Date | null;
  endDate?: Date | null;
  createdAt: Date;
}

// -----------------------------
// Agregar auto
// -----------------------------
export async function addCar(
  model: string,
  imageUrl: string,
  dailyRate: number,
) {
  await addDoc(collection(db, "Autos"), {
    model,
    imageUrl,
    dailyRate,
    rentedBy: null,
    renterUsername: null,
    rentDate: null,
    endDate: null,
    createdAt: new Date(),
  });
}

// -----------------------------
// Obtener todos los autos
// -----------------------------
export async function getCars(): Promise<Car[]> {
  const snapshot = await getDocs(collection(db, "Autos"));
  return snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      ...data,
      rentDate: data.rentDate?.toDate?.() || null,
      endDate: data.endDate?.toDate?.() || null,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    } as Car;
  });
}

// -----------------------------
// Actualizar auto
// -----------------------------
export async function updateCar(
  id: string,
  model: string,
  imageUrl: string,
  dailyRate: number,
) {
  const carRef = doc(db, "Autos", id);
  await updateDoc(carRef, { model, imageUrl, dailyRate });
}

// -----------------------------
// Eliminar auto
// -----------------------------
export async function deleteCar(id: string) {
  const carRef = doc(db, "Autos", id);
  await deleteDoc(carRef);
}

// -----------------------------
// Reservar auto con fechas
// -----------------------------
export async function rentCar(
  id: string,
  userId: string,
  startDate: string | Date,
  endDate: string | Date,
  renterUsername?: string,
) {
  const carRef = doc(db, "Autos", id);
  const rentDate = new Date(startDate);
  const end = new Date(endDate);

  await updateDoc(carRef, {
    rentedBy: userId,
    renterUsername: renterUsername || null,
    rentDate,
    endDate: end,
  });
}

// -----------------------------
// Eliminar alquiler (liberar auto)
// -----------------------------
export async function deleteRent(id: string) {
  const carRef = doc(db, "Autos", id);
  await updateDoc(carRef, {
    rentedBy: null,
    renterUsername: null,
    rentDate: null,
    endDate: null,
  });
}

// -----------------------------
// Obtener autos de un usuario
// -----------------------------
export async function getUserBookings(userId: string): Promise<Car[]> {
  const snapshot = await getDocs(collection(db, "Autos"));
  const cars = snapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      ...data,
      rentDate: data.rentDate?.toDate?.() || null,
      endDate: data.endDate?.toDate?.() || null,
      createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
    } as Car;
  });

  return cars.filter((car) => car.rentedBy === userId);
}
