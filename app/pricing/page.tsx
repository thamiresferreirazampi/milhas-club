'use client'

import { useState } from 'react'

export default function Pricing() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')

  async function handleCheckout() {
    if (!email) {
      alert('Digite seu email')
      return
    }
    setLoading(true)

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    const data = await response.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Erro ao iniciar pagamento')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-blue-50 py-16 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
          Milhas Club
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Acesso completo a todos os modulos e aulas
        </p>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-6">
            <p className="text-gray-500 text-sm">Pagamento unico</p>
            <p className="text-4xl font-bold text-gray-900">R$ 197</p>
            <p className="text-gray-500 text-sm">acesso vitalicio</p>
          </div>

          <ul className="space-y-3 mb-8">
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500">✓</span> 6 modulos completos
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500">✓</span> 35+ aulas praticas
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500">✓</span> Acesso vitalicio
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="text-green-500">✓</span> Atualizacoes gratuitas
            </li>
          </ul>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Processando...' : 'Comprar agora'}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Pagamento seguro via Stripe
        </p>
      </div>
    </main>
  )
}