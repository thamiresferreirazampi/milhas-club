'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Plane } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  duration_minutes: number
  order_index: number
  is_published: boolean
}

interface Module {
  id: string
  title: string
  description: string
  thumbnail_url: string
}

export default function ModulePage() {
  const params = useParams()
  const [module, setModule]             = useState<Module | null>(null)
  const [lessons, setLessons]           = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading]           = useState(true)

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

      const { data: moduleData } = await supabase
        .from('modules').select('*').eq('id', params.id).single()
      if (moduleData) setModule(moduleData)

      const { data: lessonsData } = await supabase
        .from('lessons').select('*').eq('module_id', params.id)
        .eq('is_published', true).order('order_index')
      if (lessonsData) setLessons(lessonsData)

      const progressRes = await fetch(`/api/progress?module_id=${params.id}`)
      if (progressRes.ok) {
        const ids: string[] = await progressRes.json()
        setCompletedIds(new Set(ids))
      }

      setLoading(false)
    }
    loadData()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-off-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          <p className="text-brand-text-muted text-sm">Carregando módulo...</p>
        </div>
      </main>
    )
  }

  const pct             = lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0
  const isComplete      = lessons.length > 0 && completedIds.size === lessons.length
  const firstIncomplete = lessons.find((l) => !completedIds.has(l.id))
  const continueLesson  = firstIncomplete ?? lessons[0]

  return (
    <main className="min-h-screen bg-brand-off-white">

      {/* Header */}
      <header className="bg-white border-b border-brand-border sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-extrabold text-brand-blue-dark tracking-tight text-base">
              Milhas<span className="text-brand-blue">Club</span>
            </span>
          </a>
          <a href="/dashboard" className="flex items-center gap-1.5 text-brand-text-muted hover:text-brand-blue text-sm transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Dashboard
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero do módulo */}
        <div className="bg-white rounded-2xl border border-brand-border shadow-card overflow-hidden mb-6">
          {module?.thumbnail_url && (
            <div className="relative h-48 overflow-hidden">
              <img src={module.thumbnail_url} alt={module.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue-dark/60 via-transparent to-transparent" />
              {isComplete && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-brand-success text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Módulo concluído
                </div>
              )}
            </div>
          )}

          <div className="p-5 md:p-6">
            <h1 className="text-2xl md:text-3xl text-brand-blue-dark mb-1.5">{module?.title}</h1>
            <p className="text-brand-text-secondary text-sm leading-relaxed mb-5">{module?.description}</p>

            <div className="mb-5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-brand-text-muted">{completedIds.size} de {lessons.length} aulas</span>
                <span className={`font-bold ${isComplete ? 'text-brand-success' : 'text-brand-blue'}`}>{pct}%</span>
              </div>
              <div className="w-full bg-brand-border rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{ width: `${pct}%`, background: isComplete ? '#22C55E' : '#006BFF' }}
                />
              </div>
            </div>

            {continueLesson && !isComplete && (
              <a
                href={'/aula/' + continueLesson.id}
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-btn"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {completedIds.size === 0 ? 'Começar módulo' : 'Continuar de onde parei'}
              </a>
            )}

            {isComplete && (
              <a
                href={`/certificado/${params.id}`}
                className="inline-flex items-center gap-2 bg-brand-success hover:opacity-90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:-translate-y-0.5 shadow-sm"
              >
                🎓 Ver meu certificado
              </a>
            )}
          </div>
        </div>

        {/* Lista de aulas */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-brand-text">Aulas</h2>
          <span className="text-sm text-brand-text-muted">{lessons.length} aulas</span>
        </div>

        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            const done      = completedIds.has(lesson.id)
            const isCurrent = lesson.id === continueLesson?.id && !isComplete

            return (
              <a
                key={lesson.id}
                href={'/aula/' + lesson.id}
                className={`group flex items-center gap-4 bg-white rounded-xl px-4 py-3.5 border transition-all hover:shadow-sm ${
                  isCurrent
                    ? 'border-brand-blue shadow-sm bg-brand-blue-soft'
                    : 'border-brand-border hover:border-brand-blue'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  done
                    ? 'bg-brand-success/15 text-brand-success'
                    : isCurrent
                    ? 'bg-brand-blue text-white'
                    : 'bg-brand-blue-soft text-brand-text-muted group-hover:bg-brand-blue group-hover:text-white transition-colors'
                }`}>
                  {done ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : isCurrent ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                  ) : (
                    index + 1
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug truncate ${
                    done ? 'text-brand-text-muted line-through decoration-brand-text-muted' : 'text-brand-text'
                  }`}>
                    {lesson.title}
                  </p>
                  <p className="text-brand-text-muted text-xs mt-0.5 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {lesson.duration_minutes} min
                  </p>
                </div>

                <svg
                  className="flex-shrink-0 text-brand-border group-hover:text-brand-blue transition-colors"
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            )
          })}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-16 text-brand-text-muted">
            <p className="text-3xl mb-3">🎬</p>
            <p className="font-medium text-brand-text">Nenhuma aula disponível ainda.</p>
            <p className="text-sm mt-1">O conteúdo será liberado em breve!</p>
          </div>
        )}
      </div>
    </main>
  )
}
