export default function Home() {
  return (
    <main className="min-h-screen bg-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">✈️ Milhas Club</h1>
          <a 
            href="/login" 
            className="bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600"
          >
            Entrar
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Aprenda a viajar<br />
          <span className="text-pink-500">pagando muito menos</span>
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          O método passo a passo para acumular milhas e emitir passagens 
          com até 80% de desconto.
        </p>
        <a 
          href="/register" 
          className="bg-pink-500 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-pink-600 inline-block"
        >
          Começar Agora →
        </a>
      </section>
    </main>
  )
}