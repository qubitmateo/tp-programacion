import Image from "next/image";

export default function AutoPage() {
  return (
    <main className="min-h-screen bg-white text-gray-900 font-sans flex flex-col items-center justify-center py-20">
      <h1 className="text-4xl font-bold mb-6">Toyota Corolla 2022</h1>
      <Image
        src="/corolla.webp"
        alt="Toyota Corolla"
        width={400}
        height={250}
        className="rounded-xl shadow mb-6"
      />
      <div className="max-w-md text-lg">
        <p><strong>Características:</strong></p>
        <ul className="list-disc ml-6 mb-4">
          <li>Motor 1.8L</li>
          <li>Automático</li>
          <li>5 pasajeros</li>
          <li>Bluetooth, aire acondicionado</li>
        </ul>
        <p className="mb-2"><strong>Precio por día:</strong> $25.000</p>
        <p className="mb-6"><strong>Disponible para alquilar ahora mismo.</strong></p>
      </div>
    </main>
  );
}