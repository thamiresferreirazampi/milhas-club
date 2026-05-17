'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

interface Lesson {
  id: string
  title: string
  description: string
  duration_minutes: number
  order_index: number
  is_preview: boolean
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
  const [module, setModule] = useState<Module | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

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

      const { data: moduleData } = await supabase
        .from('modules')
        .select('*')
        .eq('id', params.id)
        .single()

      if (moduleData) setModule(moduleData)

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', params.id)
        .eq('is_published', true)
        .order('order_index')

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
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-pink-400 border-t-transparent animate-spin" />
          <p className="text-gray-400 text-sm">Carregando módulo...</p>
        </div>
      </main>
    )
  }

  const pct = lessons.length > 0 ? Math.round((completedIds.size / lessons.length) * 100) : 0
  const isComplete = lessons.length > 0 && completedIds.size === lessons.length

  const firstIncomplete = lessons.find((l) => !completedIds.has(l.id))
  const continueLesson = firstIncomplete ?? lessons[0]

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="text-pink-500 text-lg">✈</span>
            <span className="font-bold text-gray-900 tracking-tight">Milhas Club</span>
          </a>
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 text-gray-400 hover:text-gray-700 text-sm transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Dashboard
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Hero do módulo */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {module?.thumbnail_url && (
            <div className="relative h-48 overflow-hidden">
              <img
                src={module.thumbnail_url}
                alt={module.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              {isComplete && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Módulo concluído
                </div>
              )}
            </div>
          )}

          <div className="p-5 md:p-6">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1.5">{module?.title}</h1>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">{module?.description}</p>

            {/* Progresso */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">{completedIds.size} de {lessons.length} aulas</span>
                  <span className={`font-bold ${isComplete ? 'text-green-500' : 'text-pink-500'}`}>{pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${isComplete ? 'bg-green-400' : 'bg-pink-400'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Botão de continuar / começar */}
            {continueLesson && !isComplete && (
              <a
                href={'/aula/' + continueLesson.id}
                className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-pink-100 hover:shadow-pink-200 transition-all hover:-translate-y-px"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {completedIds.size === 0 ? 'Começar módulo' : 'Continuar de onde parei'}
              </a>
            )}

            {/* Certificado */}
            {isComplete && (
              <a
                href={`/certificado/${params.id}`}
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-green-100 hover:shadow-green-200 transition-all hover:-translate-y-px"
              >
                🎓 Ver meu certificado
              </a>
            )}
          </div>
        </div>

        {/* Lista de aulas */}
        <h2 className="text-base font-bold text-gray-900 mb-3 flex items-center justify-between">
          Aulas
          <span className="text-sm font-normal text-gray-400">{lessons.length} aulas</span>
        </h2>

        <div className="space-y-2">
          {lessons.map((lesson, index) => {
            const done = completedIds.has(lesson.id)
            const isCurrent = lesson.id === continueLesson?.id && !isComplete

            return (
              <a
                key={lesson.id}
                href={'/aula/' + lesson.id}
                className={`group flex items-center gap-4 bg-white border rounded-xl px-4 py-3.5 transition-all hover:shadow-sm ${
                  isCurrent
                    ? 'border-pink-200 bg-pink-50/50 shadow-sm'
                    : done
                    ? 'border-gray-100 opacity-80 hover:opacity-100'
                    : 'border-gray-100 hover:border-pink-200'
                }`}
              >
                {/* Status */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-colors ${
                  done
                    ? 'bg-green-100 text-green-600'
                    : isCurrent
                    ? 'bg-pink-500 text-white'
                    : 'bg-gray-100 text-gray-400 group-hover:bg-pink-100 group-hover:text-pink-500'
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

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold leading-snug truncate ${
                    done ? 'text-gray-400 line-through decoration-gray-300' : 'text-gray-900'
                  }`}>
                    {lesson.title}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    {lesson.duration_minutes} min
                  </p>
                </div>

                {/* Seta */}
                <svg
                  className={`flex-shrink-0 transition-colors ${done ? 'text-gray-200' : 'text-gray-300 group-hover:text-pink-400'}`}
                  width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            )
          })}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <p className="text-3xl mb-3">🎬</p>
            <p className="font-medium">Nenhuma aula disponível ainda.</p>
            <p className="text-sm mt-1">O conteúdo será liberado em breve!</p>
          </div>
        )}
      </div>
    </main>
  )
}
