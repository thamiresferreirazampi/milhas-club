export default function Sucesso() {
  return (
    <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Pagamento confirmado!</h1>
        <p className="text-gray-600 mb-6">Seu acesso ao Milhas Club foi liberado.</p>
        <a href="/dashboard" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">Acessar meus modulos</a>
      </div>
    </main>
  )
}