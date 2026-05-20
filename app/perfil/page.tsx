'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plane } from 'lucide-react'

export default function PerfilPage() {
  const [user, setUser]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving]   = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }
      setUser(user)
      setLoading(false)
    }
    load()
  }, [])

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'As senhas não coincidem.' })
      return
    }
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 6 caracteres.' })
      return
    }

    setSaving(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      setMessage({ type: 'error', text: 'Senha atual incorreta.' })
      setSaving(false)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="w-7 h-7 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
      </main>
    )
  }

  const memberSince = new Date(user.created_at).toLocaleDateString('pt-BR', {
    month: 'long', year: 'numeric',
  })

  const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-white placeholder-brand-gray-light outline-none transition-all"
  const inputStyle = { background: '#111827', border: '1px solid #2E3548' }

  return (
    <main className="min-h-screen bg-brand-black">
      <header className="bg-brand-card border-b border-brand-border">
        <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-extrabold text-white text-base tracking-tight">
              Milhas<span className="text-brand-blue">Club</span>
            </span>
          </a>
          <a href="/dashboard" className="text-sm text-brand-gray-light hover:text-white transition-colors">← Dashboard</a>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-5">

        {/* Info da conta */}
        <div style={{ background: 'linear-gradient(180deg, #14213D 0%, #182845 100%)', border: '1px solid #2F4E85', borderRadius: 16, padding: 24 }}>
          <h2 className="text-xl text-white mb-5">Minha conta</h2>
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ background: 'linear-gradient(135deg, #1D6FFF, #3B82FF)' }}
            >
              {user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-white">{user.email}</p>
              <p className="text-sm text-brand-gray-light">Membro desde {memberSince}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div style={{ background: '#1B2B4F', border: '1px solid #2F4E85', borderRadius: 12, padding: 16 }}>
              <p className="text-xs text-brand-gray-light mb-1">E-mail</p>
              <p className="text-sm font-medium text-white">{user.email}</p>
            </div>
            <div style={{ background: '#1B2B4F', border: '1px solid #2F4E85', borderRadius: 12, padding: 16 }}>
              <p className="text-xs text-brand-gray-light mb-1">Plano</p>
              <p className="text-sm font-medium text-brand-success">Acesso vitalício ✓</p>
            </div>
          </div>
        </div>

        {/* Alterar senha */}
        <div style={{ background: 'linear-gradient(180deg, #14213D 0%, #182845 100%)', border: '1px solid #2F4E85', borderRadius: 16, padding: 24 }}>
          <h2 className="text-xl text-white mb-1">Alterar senha</h2>
          <p className="text-sm text-brand-gray-light mb-6">Escolha uma senha com pelo menos 6 caracteres.</p>

          {message && (
            <div
              className={`mb-4 px-4 py-3 rounded-xl text-sm ${
                message.type === 'success' ? 'text-brand-success' : 'text-brand-error'
              }`}
              style={{
                background: message.type === 'success' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                border: `1px solid ${message.type === 'success' ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
              }}
            >
              {message.text}
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4">
            {[
              { label: 'Senha atual', value: currentPassword, setter: setCurrentPassword },
              { label: 'Nova senha', value: newPassword, setter: setNewPassword },
              { label: 'Confirmar nova senha', value: confirmPassword, setter: setConfirmPassword },
            ].map(({ label, value, setter }) => (
              <div key={label}>
                <label className="block text-xs font-bold text-brand-gray-light mb-1.5 uppercase tracking-widest">
                  {label}
                </label>
                <input
                  type="password"
                  required
                  value={value}
                  onChange={e => setter(e.target.value)}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-brand-blue hover:bg-brand-blue-hover text-white py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Alterar senha'}
            </button>
          </form>
        </div>

        {/* Sessão */}
        <div style={{ background: 'linear-gradient(180deg, #14213D 0%, #182845 100%)', border: '1px solid #2F4E85', borderRadius: 16, padding: 24 }}>
          <h2 className="text-xl text-white mb-1">Sessão</h2>
          <p className="text-sm text-brand-gray-light mb-4">Encerrar sua sessão em todos os dispositivos.</p>
          <button
            onClick={async () => { await supabase.auth.signOut(); window.location.href = '/' }}
            className="text-sm text-brand-error border px-4 py-2 rounded-xl transition-colors hover:bg-brand-error/10"
            style={{ borderColor: 'rgba(239,68,68,0.3)' }}
          >
            Sair da conta
          </button>
        </div>

      </div>
    </main>
  )
}
