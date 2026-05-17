'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Module {
  id: string
  title: string
  description: string
  thumbnail_url: string
  order_index: number
}

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([])
  const [lessonCounts, setLessonCounts] = useState<Record<string, number>>({})
  const [completedCounts, setCompletedCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const isAdmin = user.email === 'thamires.ferreirazampitravel@gmail.com'
      if (!isAdmin) {
        const { data: access } = await supabase
          .from('user_access')
          .select('id')
          .eq('email', user.email!)
          .single()

        if (!access) {
          window.location.href = '/pricing'
          return
        }
      }

      setUser(user)

      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_index')

      if (modulesData) {
        setModules(modulesData)

        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('id, module_id')
          .eq('is_published', true)
          .in('module_id', modulesData.map((m: Module) => m.id))

        const { data: progressData } = await supabase
          .from('lesson_progress')
          .select('lesson_id, lessons!inner(module_id)')
          .eq('user_id', user.id)

        const counts: Record<string, number> = {}
        const completed: Record<string, number> = {}

        for (const m of modulesData) {
          counts[m.id] = (lessonsData ?? []).filter((l: { module_id: string }) => l.module_id === m.id).length
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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Carregando...</p>
        </div>
      </main>
    )
  }

  const totalLessons = Object.values(lessonCounts).reduce((a, b) => a + b, 0)
  const totalCompleted = Object.values(completedCounts).reduce((a, b) => a + b, 0)
  const overallPct = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0
  const modulesInProgress = modules.filter(m => completedCounts[m.id] > 0 && completedCounts[m.id] < lessonCounts[m.id]).length
  const modulesCompleted = modules.filter(m => lessonCounts[m.id] > 0 && completedCounts[m.id] === lessonCounts[m.id]).length

  const firstName = user?.email?.split('@')[0] ?? 'aluno'

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-pink-500 text-lg">✈</span>
            <span className="font-bold text-gray-900 tracking-tight">Milhas Club</span>
          </a>
          <div className="flex items-center gap-3">
            {user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && (
              <a
                href="/admin"
                className="text-xs bg-amber-50 text-amber-600 border border-amber-200 px-3 py-1.5 rounded-lg font-medium hover:bg-amber-100 transition-colors"
              >
                Admin
              </a>
            )}
            <a
              href="/perfil"
              className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white text-xs font-bold">
                {firstName[0]?.toUpperCase()}
              </div>
              <span className="hidden sm:block max-w-[140px] truncate">{user?.email}</span>
            </a>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-gray-700 text-sm transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Saudação + progresso geral */}
        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl p-6 md:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: 'radial-gradient(circle at 90% 10%, white 1.5px, transparent 1.5px)',
            backgroundSize: '30px 30px'
          }} />
          <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-pink-200 text-sm font-medium mb-1">Bem-vinda de volta,</p>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">{firstName} ✈</h1>
              <p className="text-pink-100 text-sm mt-1">
                {overallPct === 0
                  ? 'Comece sua jornada pelo primeiro módulo!'
                  : overallPct === 100
                  ? 'Parabéns! Você concluiu todo o conteúdo! 🎉'
                  : `Você está indo muito bem — continue assim!`}
              </p>
            </div>

            {/* Progresso geral */}
            <div className="bg-white/15 rounded-2xl px-6 py-4 min-w-[200px]">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-pink-100 font-medium">Progresso geral</span>
                <span className="text-white font-bold">{overallPct}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 mb-3">
                <div
                  className="bg-white h-2.5 rounded-full transition-all"
                  style={{ width: `${overallPct}%` }}
                />
              </div>
              <p className="text-pink-200 text-xs">{totalCompleted} de {totalLessons} aulas concluídas</p>
            </div>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Módulos', value: modules.length, sub: 'no total' },
            { label: 'Em progresso', value: modulesInProgress, sub: 'módulos' },
            { label: 'Concluídos', value: modulesCompleted, sub: 'módulos', highlight: modulesCompleted > 0 },
          ].map((stat) => (
            <div
              key={stat.label}
              className={`bg-white border rounded-2xl p-4 text-center shadow-sm ${
                stat.highlight ? 'border-green-200 bg-green-50' : 'border-gray-100'
              }`}
            >
              <p className={`text-2xl font-extrabold ${stat.highlight ? 'text-green-600' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className="text-gray-500 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Módulos */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Seus Módulos</h2>
          <span className="text-sm text-gray-400">{modules.length} módulos</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {modules.map((mod) => {
            const total = lessonCounts[mod.id] ?? 0
            const done = completedCounts[mod.id] ?? 0
            const pct = total > 0 ? Math.round((done / total) * 100) : 0
            const isComplete = total > 0 && done === total
            const isStarted = done > 0 && !isComplete

            return (
              <a
                key={mod.id}
                href={'/modulo/' + mod.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-200 transition-all"
              >
                {/* Thumbnail */}
                <div className="relative overflow-hidden">
                  <img
                    src={mod.thumbnail_url}
                    alt={mod.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {isComplete && (
                    <div className="absolute inset-0 bg-green-500/80 flex items-center justify-center">
                      <div className="text-center text-white">
                        <div className="text-3xl mb-1">🎓</div>
                        <p className="text-xs font-bold uppercase tracking-wide">Concluído</p>
                      </div>
                    </div>
                  )}
                  {isStarted && (
                    <div className="absolute top-2 right-2 bg-pink-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow">
                      Em andamento
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-pink-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mb-3 line-clamp-2">{mod.description}</p>

                  {total > 0 ? (
                    <div>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">{done} de {total} aulas</span>
                        <span className={`font-semibold ${isComplete ? 'text-green-500' : 'text-pink-500'}`}>
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full transition-all ${isComplete ? 'bg-green-400' : 'bg-pink-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-300 text-xs">Nenhuma aula ainda</p>
                  )}
                </div>
              </a>
            )
          })}
        </div>

        {modules.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">✈️</p>
            <p className="font-medium">Nenhum módulo disponível ainda.</p>
            <p className="text-sm mt-1">O conteúdo será liberado em breve!</p>
          </div>
        )}
      </div>
    </main>
  )
}
