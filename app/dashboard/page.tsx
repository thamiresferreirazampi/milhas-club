'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Plane } from 'lucide-react'

interface Module {
  id: string
  title: string
  description: string
  thumbnail_url: string
  order_index: number
}

export default function Dashboard() {
  const [modules, setModules]               = useState<Module[]>([])
  const [lessonCounts, setLessonCounts]     = useState<Record<string, number>>({})
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({})
  const [loading, setLoading]               = useState(true)
  const [user, setUser]                     = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const isAdmin = user.email === 'thamires.ferreirazampitravel@gmail.com'
      if (!isAdmin) {
        const { data: access } = await supabase
          .from('user_access').select('id').eq('email', user.email!).single()
        if (!access) { window.location.href = '/pricing'; return }
      }

      setUser(user)

      const { data: modulesData } = await supabase
        .from('modules').select('*').eq('is_published', true).order('order_index')

      if (modulesData) {
        setModules(modulesData)

        const { data: lessonsData } = await supabase
          .from('lessons').select('id, module_id').eq('is_published', true)
          .in('module_id', modulesData.map((m: Module) => m.id))

        const { data: progressData } = await supabase
          .from('lesson_progress').select('lesson_id, lessons!inner(module_id)')
          .eq('user_id', user.id)

        const counts: Record<string, number> = {}
        const completed: Record<string, number> = {}

        for (const m of modulesData) {
          counts[m.id]    = (lessonsData ?? []).filter((l: { module_id: string }) => l.module_id === m.id).length
          completed[m.id] = (progressData ?? []).filter(
            (p: { lessons: { module_id: string }[] }) =>
              Array.isArray(p.lessons) && p.lessons[0]?.module_id === m.id
          ).length
        }

        setLessonCounts(counts)
        setCompletedCounts(completed)
      }

      setLoading(false)
    }
    loadData()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          <p className="text-brand-gray text-sm">Carregando...</p>
        </div>
      </main>
    )
  }

  const totalLessons   = Object.values(lessonCounts).reduce((a, b) => a + b, 0)
  const totalCompleted = Object.values(completedCounts).reduce((a, b) => a + b, 0)
  const overallPct     = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
  const modulesInProgress = modules.filter(m => completedCounts[m.id] > 0 && completedCounts[m.id] < lessonCounts[m.id]).length
  const modulesCompleted  = modules.filter(m => lessonCounts[m.id] > 0 && completedCounts[m.id] === lessonCounts[m.id]).length
  const firstName = user?.email?.split('@')[0] ?? 'aluno'

  return (
    <main className="min-h-screen bg-brand-black">

      {/* Header */}
      <header className="bg-brand-card border-b border-brand-border sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-extrabold text-white tracking-tight text-base">
              Milhas<span className="text-brand-blue">Club</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <a
                href="/admin"
                className="text-xs bg-brand-blue/10 text-brand-blue border border-brand-blue/30 px-3 py-1.5 rounded-lg font-medium hover:bg-brand-blue/20 transition-colors"
              >
                Admin
              </a>
            )}
            <a href="/perfil" className="flex items-center gap-2 text-brand-gray-light hover:text-white text-sm transition-colors">
              <div className="w-7 h-7 rounded-full bg-brand-blue flex items-center justify-center text-white text-xs font-bold">
                {firstName[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block max-w-[140px] truncate">{user?.email}</span>
            </a>
            <button onClick={handleLogout} className="text-brand-gray hover:text-white text-sm transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Banner de boas-vindas */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1E6BFF 0%, #0B0B0F 100%)' }}
        >
          <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle at 90% 10%, white 1.5px, transparent 1.5px)', backgroundSize: '30px 30px' }}
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
            <Plane className="w-40 h-40 text-white -rotate-12" />
          </div>
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-blue-200 text-sm font-medium mb-1">Bem-vinda de volta,</p>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{firstName} ✈</h1>
              <p className="text-blue-100 text-sm mt-1">
                {overallPct === 0
                  ? 'Comece sua jornada pelo primeiro módulo!'
                  : overallPct === 100
                  ? 'Parabéns! Você concluiu todo o conteúdo! 🎉'
                  : 'Você está indo muito bem — continue assim!'}
              </p>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl px-6 py-4 min-w-[200px]">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-200 font-medium">Progresso geral</span>
                <span className="text-white font-bold">{overallPct}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${overallPct}%` }} />
              </div>
              <p className="text-blue-200 text-xs">{totalCompleted} de {totalLessons} aulas concluídas</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Módulos', value: modules.length },
            { label: 'Em progresso', value: modulesInProgress },
            { label: 'Concluídos', value: modulesCompleted, blue: modulesCompleted > 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-brand-card border rounded-2xl p-4 text-center ${
                stat.blue ? 'border-brand-blue/40 bg-brand-blue/5' : 'border-brand-border'
              }`}
            >
              <p className={`text-2xl font-extrabold ${stat.blue ? 'text-brand-blue' : 'text-white'}`}>
                {stat.value}
              </p>
              <p className="text-brand-gray text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Módulos */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Seus Módulos</h2>
          <span className="text-sm text-brand-gray">{modules.length} módulos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const total      = lessonCounts[mod.id] ?? 0
            const done       = completedCounts[mod.id] ?? 0
            const pct        = total > 0 ? Math.round((done / total) * 100) : 0
            const isComplete = total > 0 && done === total
            const isStarted  = done > 0 && !isComplete

            return (
              <a
                key={mod.id}
                href={'/modulo/' + mod.id}
                className="group bg-brand-card rounded-2xl overflow-hidden border border-brand-border hover:border-brand-blue/40 transition-all"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={mod.thumbnail_url}
                    alt={mod.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isComplete && (
                    <div className="absolute inset-0 bg-brand-blue/80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-3xl mb-1">🎓</div>
                        <p className="text-xs font-bold uppercase tracking-wide">Concluído</p>
                      </div>
                    </div>
                  )}
                  {isStarted && (
                    <div className="absolute top-2 right-2 bg-brand-blue text-white text-xs font-bold px-2.5 py-1 rounded-full">
                      Em andamento
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-white text-sm mb-1 group-hover:text-brand-blue transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-brand-gray text-xs leading-relaxed mb-3 line-clamp-2">{mod.description}</p>

                  {total > 0 ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-brand-gray">{done} de {total} aulas</span>
                        <span className={`font-semibold ${isComplete ? 'text-brand-blue' : 'text-brand-blue-hover'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-brand-border rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full transition-all bg-brand-blue"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-brand-gray text-xs">Nenhuma aula ainda</p>
                  )}
                </div>
              </a>
            )
          })}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-20 text-brand-gray">
            <Plane className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium text-white">Nenhum módulo disponível ainda.</p>
            <p className="text-sm mt-1">O conteúdo será liberado em breve!</p>
          </div>
        )}
      </div>
    </main>
  )
}
