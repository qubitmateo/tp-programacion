// app/page.tsx

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fefefe] text-gray-900 font-sans">
      {/* Hero Section */}
      <section className="bg-[#f0f9ff] py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4 text-blue-700">
            AMAUTOS
          </h1>
          <p className="text-xl text-gray-600 max-w-xl mx-auto mb-8">
            Alquilá tu auto ideal sin complicaciones. Rápido, simple y con buena onda.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded-full shadow-md hover:bg-blue-700 transition font-semibold">
              🚗 Ver Autos
            </button>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full border border-blue-300 shadow hover:bg-blue-50 transition font-semibold">
              📞 Contactar
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10">¿Qué nos hace únicos?</h2>
          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="p-6 bg-[#f0f9ff] rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🚘 Autos para todos</h3>
              <p className="text-gray-600">Compactos, familiares, pickups... lo que necesites, lo tenemos.</p>
            </div>
            <div className="p-6 bg-[#fef6f0] rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">💰 Precios sin sorpresas</h3>
              <p className="text-gray-600">Pagás lo que ves. Sin cargos ocultos, sin letras chicas.</p>
            </div>
            <div className="p-6 bg-[#f0fef4] rounded-2xl shadow hover:shadow-lg transition">
              <h3 className="text-xl font-semibold mb-2">🤝 Atención humana</h3>
              <p className="text-gray-600">Te ayudamos como si fueras un amigo. Así de simple.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-50 to-blue-100 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">Listo para arrancar tu próxima aventura?</h2>
          <p className="text-gray-700 mb-8">
            Alquilá tu auto ideal hoy mismo. Es fácil, rápido y sin vueltas.
          </p>
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg shadow hover:bg-blue-700 transition font-semibold">
            Reservar Ahora
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} AMAUTOS. Con cariño desde Esperanza y Olinda.</p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="hover:text-white transition">Instagram</a>
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">WhatsApp</a>
          </div>
        </div>
      </footer>
    </main>
  );
}

