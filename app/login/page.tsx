'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plane, ArrowRight } from 'lucide-react'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Email ou senha incorretos')
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <main className="min-h-screen bg-brand-sky flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center shadow-btn">
            <Plane className="w-5 h-5 text-white -rotate-45" />
          </div>
          <span className="text-xl font-extrabold text-brand-blue-dark tracking-tight">
            Milhas<span className="text-brand-blue">Club</span>
          </span>
        </a>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-8">
          <h1 className="text-4xl text-brand-blue-dark mb-1">Bem-vinda de volta</h1>
          <p className="text-brand-text-muted text-sm mb-8">Entre para acessar seus conteúdos</p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-text-muted mb-1.5 uppercase tracking-widest">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 text-brand-text text-sm"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-text-muted mb-1.5 uppercase tracking-widest">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 text-brand-text text-sm"
                placeholder="••••••••"
                required
              />
            </div>

            {error && <p className="text-brand-error text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-btn hover:-translate-y-0.5"
            >
              {loading ? 'Entrando...' : <><span>Entrar</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-brand-text-muted text-sm">
            Não tem conta?{' '}
            <a href="/register" className="text-brand-blue font-semibold hover:text-brand-blue-hover transition-colors">
              Cadastre-se
            </a>
          </p>
        </div>

        <p className="text-center mt-5">
          <a href="/" className="text-brand-text-muted text-xs hover:text-brand-blue transition-colors">← Voltar ao site</a>
        </p>
      </div>
    </main>
  )
}
