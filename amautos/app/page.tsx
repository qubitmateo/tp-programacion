"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

type DocData = {
  id: string;
  [key: string]: any;
};

export default function Page() {
  const [docs, setDocs] = useState<DocData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const querySnapshot = await getDocs(collection(db, "test"));
        const data: DocData[] = querySnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDocs(data);
      } catch (err) {
        setError("Error al leer Firestore");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Cargando datos de Firestore...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Datos desde Firestore</h1>
      {docs.length === 0 ? (
        <p>No hay documentos en la colección "test".</p>
      ) : (
        <ul>
          {docs.map((doc) => (
            <li key={doc.id}>
              <pre>{JSON.stringify(doc, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

