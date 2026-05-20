'use client'

import { useState } from 'react'
import { Plane, Check, X, Shield, Lock, ArrowRight, Star } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Plan = 'basic' | 'premium'

export default function Pricing() {
  const [selectedPlan, setSelectedPlan] = useState<Plan>('premium')
  const [loading, setLoading]           = useState(false)
  const [email, setEmail]               = useState('')
  const [error, setError]               = useState('')

  async function handleCheckout() {
    if (!email || !email.includes('@')) { setError('Digite um e-mail válido'); return }
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

  return (
    <main className="min-h-screen bg-brand-black px-4 py-16 relative overflow-hidden">
      {/* Glow de fundo */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #1E6BFF 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto relative">

        {/* Logo */}
        <div className="flex justify-center mb-10">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center">
              <Plane className="w-4 h-4 text-white -rotate-45" />
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">
              Milhas<span className="text-brand-blue">Club</span>
            </span>
          </a>
        </div>

        {/* Título */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-blue/10 border border-brand-blue/30 text-brand-blue text-xs font-bold px-4 py-2 rounded-full mb-5">
            <Plane className="w-3.5 h-3.5 -rotate-45" />
            Escolha o plano ideal para você
          </div>
          <h1 className="text-5xl md:text-6xl text-white mb-3">
            Comece a acumular milhas hoje
          </h1>
          <p className="text-brand-gray-light text-lg max-w-lg mx-auto">
            Pagamento único. Acesso para sempre. Sem mensalidades.
          </p>
        </div>

        {/* Cards de plano */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10 max-w-3xl mx-auto">

          {/* Básico */}
          <motion.button
            onClick={() => setSelectedPlan('basic')}
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.99 }}
            className={`text-left rounded-2xl p-6 border-2 transition-all cursor-pointer ${
              selectedPlan === 'basic'
                ? 'border-white bg-brand-card shadow-xl'
                : 'border-brand-border bg-brand-card/60 hover:border-brand-gray'
            }`}
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs font-bold text-brand-gray uppercase tracking-widest mb-1">Básico</p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold text-white">R$&nbsp;97</span>
                  <span className="text-brand-gray text-sm mb-1.5">único</span>
                </div>
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                selectedPlan === 'basic' ? 'border-white bg-white' : 'border-brand-border'
              }`}>
                {selectedPlan === 'basic' && <Check className="w-3.5 h-3.5 text-brand-black" />}
              </div>
            </div>

            <p className="text-brand-gray-light text-sm mb-5">Ideal para começar e entender o mundo das milhas.</p>

            <ul className="space-y-2.5">
              {plans.basic.features.map((f) => (
                <li key={f.label} className="flex items-center gap-2.5 text-sm">
                  {f.included ? (
                    <span className="w-4 h-4 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-brand-blue" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full bg-brand-border flex items-center justify-center flex-shrink-0">
                      <Lock className="w-2.5 h-2.5 text-brand-gray" />
                    </span>
                  )}
                  <span className={f.included ? 'text-white' : 'text-brand-gray'}>{f.label}</span>
                </li>
              ))}
            </ul>
          </motion.button>

          {/* Premium */}
          <div className="relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-brand-blue text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-brand-blue/30">
                <Star className="w-3 h-3 fill-white" /> Mais popular
              </span>
            </div>

            <motion.button
              onClick={() => setSelectedPlan('premium')}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.99 }}
              className={`w-full text-left rounded-2xl p-6 border-2 transition-all cursor-pointer ${
                selectedPlan === 'premium'
                  ? 'border-brand-blue bg-brand-card shadow-xl shadow-brand-blue/10'
                  : 'border-brand-blue/30 bg-brand-card/60 hover:border-brand-blue/60'
              }`}
            >
              <div className="flex items-start justify-between mb-5 pt-2">
                <div>
                  <p className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-1">Premium</p>
                  <div className="flex items-center gap-3 mb-0.5">
                    <span className="text-brand-gray line-through text-base">R$&nbsp;497</span>
                    <span className="bg-brand-blue/15 text-brand-blue text-xs font-bold px-2.5 py-1 rounded-full border border-brand-blue/30">60% OFF</span>
                  </div>
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-extrabold text-white">R$&nbsp;197</span>
                    <span className="text-brand-gray text-sm mb-1.5">único</span>
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${
                  selectedPlan === 'premium' ? 'border-brand-blue bg-brand-blue' : 'border-brand-blue/40'
                }`}>
                  {selectedPlan === 'premium' && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <p className="text-brand-gray-light text-sm mb-5">Acesso completo a todo o conteúdo e suporte prioritário.</p>

              <ul className="space-y-2.5">
                {plans.premium.features.map((f) => (
                  <li key={f.label} className="flex items-center gap-2.5 text-sm">
                    <span className="w-4 h-4 rounded-full bg-brand-blue/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 text-brand-blue" />
                    </span>
                    <span className="text-white">
                      {f.label}
                      {f.highlight && (
                        <span className="ml-1.5 text-[10px] bg-brand-blue/10 text-brand-blue font-bold px-1.5 py-0.5 rounded-full border border-brand-blue/20">
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

        {/* Checkout */}
        <div className="max-w-md mx-auto">
          <div className="bg-brand-card border border-brand-border rounded-2xl p-7">
            <div className="flex items-center justify-between mb-5 pb-5 border-b border-brand-border">
              <div>
                <p className="text-xs text-brand-gray font-medium mb-0.5">Plano selecionado</p>
                <p className="font-extrabold text-white">{selectedPlan === 'premium' ? 'Premium' : 'Básico'}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-brand-gray font-medium mb-0.5">Total</p>
                <p className="font-extrabold text-white text-xl">{selectedPlan === 'premium' ? 'R$ 197' : 'R$ 97'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-brand-gray mb-1.5 block uppercase tracking-widest">
                  Seu e-mail
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  onKeyDown={(e) => e.key === 'Enter' && handleCheckout()}
                  placeholder="voce@email.com"
                  className={`w-full px-4 py-3.5 border rounded-xl text-sm text-white placeholder-brand-gray outline-none transition-all bg-brand-black ${
                    error ? 'border-red-500' : 'border-brand-border focus:border-brand-blue'
                  }`}
                />
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-400 text-xs mt-1.5 flex items-center gap-1"
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
                className="w-full py-4 rounded-full font-bold text-base transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white shadow-lg shadow-brand-blue/20"
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

            <div className="flex items-center justify-center gap-4 mt-5 pt-5 border-t border-brand-border">
              <span className="flex items-center gap-1 text-brand-gray text-xs">
                <Shield className="w-3 h-3" /> Pagamento seguro
              </span>
              <span className="text-brand-border">·</span>
              <span className="text-brand-gray text-xs">Acesso imediato</span>
              <span className="text-brand-border">·</span>
              <span className="text-brand-gray text-xs">Via Stripe</span>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}

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
