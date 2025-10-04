import db from "./firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function addReserva(idAuto: string, idUsuario: string, fecha: Date) {
  await addDoc(collection(db, "Reserva"), {
    idAuto,
    idUsuario,
    fecha, 
  });
}

export async function getReservas() {
  const snapshot = await getDocs(collection(db, "Reserva"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

