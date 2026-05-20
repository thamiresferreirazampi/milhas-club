'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plane, ArrowRight } from 'lucide-react'

export default function Register() {
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [success, setSuccess]   = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-brand-sky flex items-center justify-center px-4">
        <div className="bg-white border border-brand-border p-8 rounded-2xl shadow-card w-full max-w-md text-center">
          <div className="w-14 h-14 bg-brand-blue-soft border border-brand-border rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h1 className="text-3xl text-brand-blue-dark mb-3">Cadastro realizado!</h1>
          <p className="text-brand-text-muted text-sm mb-6">Verifique seu email para confirmar sua conta.</p>
          <a href="/login" className="text-brand-blue font-semibold hover:text-brand-blue-hover transition-colors text-sm">
            Ir para o login →
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-brand-sky flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <a href="/" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-brand-blue rounded-xl flex items-center justify-center shadow-btn">
            <Plane className="w-5 h-5 text-white -rotate-45" />
          </div>
          <span className="text-xl font-extrabold text-brand-blue-dark tracking-tight">
            Milhas<span className="text-brand-blue">Club</span>
          </span>
        </a>

        <div className="bg-white rounded-2xl border border-brand-border shadow-card p-8">
          <h1 className="text-4xl text-brand-blue-dark mb-1">Crie sua conta</h1>
          <p className="text-brand-text-muted text-sm mb-8">Comece a aprender sobre milhas hoje</p>

          <form onSubmit={handleRegister} className="space-y-4">
            {[
              { label: 'Nome', type: 'text', value: name, setter: setName, placeholder: 'Seu nome' },
              { label: 'Email', type: 'email', value: email, setter: setEmail, placeholder: 'seu@email.com' },
              { label: 'Senha', type: 'password', value: password, setter: setPassword, placeholder: 'Mínimo 6 caracteres' },
            ].map(({ label, type, value, setter, placeholder }) => (
              <div key={label}>
                <label className="block text-xs font-bold text-brand-text-muted mb-1.5 uppercase tracking-widest">{label}</label>
                <input
                  type={type}
                  value={value}
                  onChange={(e) => setter(e.target.value)}
                  className="w-full px-4 py-3 text-brand-text text-sm"
                  placeholder={placeholder}
                  minLength={type === 'password' ? 6 : undefined}
                  required
                />
              </div>
            ))}

            {error && <p className="text-brand-error text-sm text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white py-3.5 rounded-xl font-bold text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2 shadow-btn hover:-translate-y-0.5"
            >
              {loading ? 'Criando conta...' : <><span>Criar conta</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <p className="text-center mt-6 text-brand-text-muted text-sm">
            Já tem conta?{' '}
            <a href="/login" className="text-brand-blue font-semibold hover:text-brand-blue-hover transition-colors">
              Fazer login
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
