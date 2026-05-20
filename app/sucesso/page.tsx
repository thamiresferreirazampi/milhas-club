import { Plane } from 'lucide-react'

export default function Sucesso() {
  return (
    <main className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div
        className="w-full max-w-md text-center"
        style={{ background: 'linear-gradient(180deg, #14213D 0%, #182845 100%)', border: '1px solid #2F4E85', borderRadius: 20, padding: 48, boxShadow: '0 24px 48px rgba(0,0,0,0.4), 0 0 60px rgba(29,111,255,0.12)' }}
      >
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(29,111,255,0.15)', border: '1px solid rgba(29,111,255,0.35)' }}
        >
          <Plane className="w-9 h-9 text-brand-blue -rotate-45" />
        </div>

        <h1 className="text-4xl text-white mb-3">Pagamento confirmado!</h1>
        <p className="text-brand-text-secondary mb-2">Seu acesso ao Milhas Club foi liberado.</p>
        <p className="text-brand-gray-light text-sm mb-8">Você já pode acessar todos os módulos disponíveis.</p>

        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-brand-blue/20"
        >
          Acessar meus módulos
        </a>
      </div>
    </main>
  )
}
