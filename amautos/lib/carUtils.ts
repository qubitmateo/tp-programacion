
import db from "./firestore";
import { collection, addDoc, getDocs } from "firebase/firestore";

export async function addCar(model: string, imageUrl: string) {
  await addDoc(collection(db, "Autos"), {
    model,
    imageUrl,
    createdAt: new Date()
  });
}

export async function getCars() {
  const snapshot = await getDocs(collection(db, "Autos"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
