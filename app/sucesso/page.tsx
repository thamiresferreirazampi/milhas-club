import { Plane } from 'lucide-react'

export default function Sucesso() {
  return (
    <main className="min-h-screen bg-brand-sky flex items-center justify-center px-4">
      <div
        className="w-full max-w-md text-center"
        style={{ background: '#FFFFFF', border: '1px solid #D8E8FF', borderRadius: 20, padding: 48, boxShadow: '0 12px 35px rgba(0,107,255,0.12)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,107,255,0.08)', border: '1px solid rgba(0,107,255,0.2)' }}
        >
          <Plane className="w-9 h-9 text-brand-blue -rotate-45" />
        </div>

        <h1 className="text-4xl text-brand-blue-dark mb-3">Pagamento confirmado!</h1>
        <p className="text-brand-text-secondary mb-2">Seu acesso ao Milhas Club foi liberado.</p>
        <p className="text-brand-text-muted text-sm mb-8">Você já pode acessar todos os módulos disponíveis.</p>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-btn hover:-translate-y-0.5"
        >
          Acessar meus módulos
        </a>
      </div>
    </main>
  )
}
