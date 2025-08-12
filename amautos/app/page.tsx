"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/register"); // redirige sin que quede en el historial
  }, [router]);

  return <p>Redirigiendo al registro...</p>;
}

