'use client'

import { useState } from 'react'
import { Plane, Check, X, Shield, Lock, ArrowRight, Sparkles, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Plan = 'basic' | 'premium'

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('premium')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  async function handleCheckout() {
    if (!email || !email.includes('@')) {
      setError('Digite um e-mail válido')
      return
    }
    setError('')
    setLoading(true)

    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, plan: selectedPlan }),
    })

    const data = await response.json()

    if (data.url) {
      window.location.href = data.url
    } else {
      setError('Erro ao iniciar pagamento. Tente novamente.')
      setLoading(false)
    }
  }

  const current = selectedPlan === 'premium' ? plans.premium : plans.basic

  return (
    <main className="min-h-screen bg-[#fdf8f6] px-4 py-16">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-center mb-10">
          <a href="/" className="flex items-center gap-2 group">
            <Plane className="text-pink-500 w-5 h-5" />
            <span className="font-extrabold text-gray-900 text-lg tracking-tight group-hover:text-pink-600 transition-colors">
              Milhas Club
            </span>
          </a>
        </div>

        {/* Título */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 bg-white border border-pink-100 text-pink-500 text-xs font-bold px-4 py-2 rounded-full shadow-sm mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            Escolha o plano ideal para você
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Comece a acumular milhas hoje
          </h1>
          <p className="text-gray-500 text-lg max-w-lg mx-auto">
            Pagamento único. Acesso para sempre. Sem mensalidades.
          </p>
        </div>

        {/* Cards de plano */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-3xl mx-auto">
          {/* ── Plano Básico ── */}
          <motion.button
            onClick={() => setSelectedPlan('basic')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className={`text-left rounded-3xl p-6 border-2 transition-all cursor-pointer ${
              selectedPlan === 'basic'
                ? 'border-gray-800 bg-white shadow-xl'
                : 'border-gray-200 bg-white/60 hover:bg-white hover:border-gray-300 shadow-sm'
            }`}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Básico</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-gray-900">R$&nbsp;97</span>
                  <span className="text-gray-400 text-sm mb-1.5">único</span>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                selectedPlan === 'basic' ? 'border-gray-800 bg-gray-800' : 'border-gray-300'
              }`}>
                {selectedPlan === 'basic' && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>

            <p className="text-gray-500 text-sm mb-5">Ideal para começar e entender o mundo das milhas.</p>

            <ul className="space-y-2.5">
              {plans.basic.features.map((f) => (
                <li key={f.label} className="flex items-center gap-2.5 text-sm">
                  {f.included ? (
                    <span className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-green-600" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Lock className="w-2.5 h-2.5 text-gray-400" />
                    </span>
                  )}
                  <span className={f.included ? 'text-gray-700' : 'text-gray-400'}>{f.label}</span>
                </li>
              ))}
            </ul>
          </motion.button>

          {/* ── Plano Premium ── */}
          <div className="relative">
            {/* Badge "Mais popular" */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-pink-200">
                <Star className="w-3 h-3 fill-white" /> Mais popular
              </span>
            </div>

            <motion.button
              onClick={() => setSelectedPlan('premium')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left rounded-3xl p-6 border-2 transition-all cursor-pointer ${
                selectedPlan === 'premium'
                  ? 'border-pink-500 bg-white shadow-xl shadow-pink-100/50'
                  : 'border-pink-200 bg-white/60 hover:bg-white hover:border-pink-300 shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between mb-5 pt-2">
                <div>
                  <p className="text-xs font-bold text-pink-400 uppercase tracking-widest mb-1">Premium</p>
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-gray-400 line-through text-base">R$&nbsp;497</span>
                    <span className="bg-pink-100 text-pink-600 text-xs font-bold px-2.5 py-1 rounded-full">60% OFF</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-gray-900">R$&nbsp;197</span>
                    <span className="text-gray-400 text-sm mb-1.5">único</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                  selectedPlan === 'premium' ? 'border-pink-500 bg-pink-500' : 'border-pink-300'
                }`}>
                  {selectedPlan === 'premium' && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <p className="text-gray-500 text-sm mb-5">Acesso completo a todo o conteúdo e suporte prioritário.</p>

              <ul className="space-y-2.5">
                {plans.premium.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-sm">
                    <span className="w-4 h-4 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-pink-500" />
                    </span>
                    <span className="text-gray-700">
                      {f.label}
                      {f.highlight && (
                        <span className="ml-1.5 text-[10px] bg-pink-50 text-pink-500 font-bold px-1.5 py-0.5 rounded-full border border-pink-100">
                          {f.highlight}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.button>
          </div>
        </div>

        {/* ── Formulário de checkout ── */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-7">
            {/* Resumo do plano selecionado */}
            <div className={`flex items-center justify-between mb-5 pb-5 border-b border-gray-100`}>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-0.5">Plano selecionado</p>
                <p className="font-extrabold text-gray-900">
                  {selectedPlan === 'premium' ? 'Premium' : 'Básico'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 font-medium mb-0.5">Total</p>
                <p className="font-extrabold text-gray-900 text-xl">
                  {selectedPlan === 'premium' ? 'R$ 197' : 'R$ 97'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block uppercase tracking-wide">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckout()}
                  placeholder="voce@email.com"
                  className={`w-full px-4 py-3.5 border rounded-xl text-sm text-gray-900 placeholder-gray-400 outline-none transition-all ${
                    error
                      ? 'border-red-300 bg-red-50 ring-2 ring-red-100'
                      : 'border-gray-200 bg-gray-50 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 focus:bg-white'
                  }`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                    >
                      <X className="w-3 h-3" /> {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                onClick={handleCheckout}
                disabled={loading}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-full font-bold text-base shadow-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                  selectedPlan === 'premium'
                    ? 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-200'
                    : 'bg-gray-900 hover:bg-gray-800 text-white shadow-gray-200'
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    Garantir acesso {selectedPlan === 'premium' ? 'Premium' : 'Básico'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </div>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-gray-100">
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <Shield className="w-3 h-3" /> Pagamento seguro
              </span>
              <span className="text-gray-200">·</span>
              <span className="text-gray-400 text-xs">Acesso imediato</span>
              <span className="text-gray-200">·</span>
              <span className="text-gray-400 text-xs">Via Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

/* ─── Planos ─────────────────────────────────────────── */
const plans = {
  basic: {
    features: [
      { label: 'Módulos 1, 2 e 3 (fundamentos)', included: true },
      { label: '10 aulas em vídeo', included: true },
      { label: 'Acesso vitalício', included: true },
      { label: 'Suporte por e-mail', included: true },
      { label: 'Módulos avançados (4, 5 e 6)', included: false },
      { label: 'Suporte prioritário', included: false },
    ],
  },
  premium: {
    features: [
      { label: 'Todos os 6 módulos completos', highlight: 'Completo' },
      { label: '35+ aulas práticas em vídeo', highlight: undefined },
      { label: 'Acesso vitalício ao conteúdo', highlight: undefined },
      { label: 'Atualizações gratuitas', highlight: 'Sempre atualizado' },
      { label: 'Suporte prioritário por e-mail', highlight: undefined },
      { label: 'Estratégias avançadas de transferência', highlight: 'Exclusivo' },
      { label: 'Acesso em qualquer dispositivo', highlight: undefined },
    ],
  },
}
