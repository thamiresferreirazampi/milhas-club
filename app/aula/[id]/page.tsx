'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Plane } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  module_id: string
  order_index: number
}

export default function AulaPage() {
  const params = useParams()
  const [lesson, setLesson]                   = useState<Lesson | null>(null)
  const [siblings, setSiblings]               = useState<Lesson[]>([])
  const [prevLesson, setPrevLesson]           = useState<Lesson | null>(null)
  const [nextLesson, setNextLesson]           = useState<Lesson | null>(null)
  const [completed, setCompleted]             = useState(false)
  const [loading, setLoading]                 = useState(true)
  const [savingProgress, setSavingProgress]   = useState(false)
  const [sidebarOpen, setSidebarOpen]         = useState(false)

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

      const { data: lessonData } = await supabase
        .from('lessons').select('*').eq('id', params.id).single()
      if (!lessonData) { setLoading(false); return }
      setLesson(lessonData)

      const [{ data: siblingsData }, { data: progress }] = await Promise.all([
        supabase.from('lessons').select('id, title, order_index, duration_minutes')
          .eq('module_id', lessonData.module_id).eq('is_published', true).order('order_index'),
        supabase.from('lesson_progress').select('lesson_id')
          .eq('user_id', user.id).eq('lesson_id', lessonData.id).single(),
      ])

      if (siblingsData) {
        setSiblings(siblingsData as Lesson[])
        const idx = siblingsData.findIndex((l: { id: string }) => l.id === lessonData.id)
        if (idx > 0) setPrevLesson(siblingsData[idx - 1] as Lesson)
        if (idx < siblingsData.length - 1) setNextLesson(siblingsData[idx + 1] as Lesson)
      }

      setCompleted(!!progress)
      setLoading(false)
    }
    loadData()
  }, [params.id])

  async function toggleCompleted() {
    if (!lesson) return
    setSavingProgress(true)
    await fetch('/api/progress', {
      method: completed ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lesson.id }),
    })
    setCompleted(!completed)
    setSavingProgress(false)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-off-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          <p className="text-brand-text-muted text-sm">Carregando aula...</p>
        </div>
      </main>
    )
  }

  if (!lesson) {
    return (
      <main className="min-h-screen bg-brand-off-white flex items-center justify-center">
        <p className="text-brand-text-muted">Aula não encontrada.</p>
      </main>
    )
  }

  const embedUrl     = lesson.video_url.includes('watch?v=')
    ? lesson.video_url.replace('watch?v=', 'embed/')
    : lesson.video_url
  const currentIndex = siblings.findIndex((s) => s.id === lesson.id)

  return (
    <main className="min-h-screen bg-brand-off-white text-brand-text">

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-brand-border bg-white">
        <div className="max-w-screen-xl mx-auto px-4 h-14 flex items-center justify-between">
          <a href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-extrabold text-brand-blue-dark tracking-tight group-hover:text-brand-blue transition-colors">
              Milhas<span className="text-brand-blue">Club</span>
            </span>
          </a>

          <div className="flex items-center gap-3">
            <a
              href={'/modulo/' + lesson.module_id}
              className="hidden sm:flex items-center gap-1.5 text-brand-text-muted hover:text-brand-blue text-sm transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Módulo
            </a>

            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden flex items-center gap-2 bg-brand-sky border border-brand-border text-brand-text-secondary text-sm px-3 py-1.5 rounded-lg transition-all hover:border-brand-blue"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
              Aulas
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto flex">

        {/* Conteúdo principal */}
        <div className="flex-1 min-w-0 px-4 py-6 md:py-8 md:pr-8">

          {/* Player */}
          <div className="relative rounded-2xl overflow-hidden bg-brand-blue-dark aspect-video mb-6 shadow-card border border-brand-border">
            <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
          </div>

          {/* Info */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="min-w-0">
              <p className="text-brand-blue text-xs font-bold uppercase tracking-widest mb-1.5">
                Aula {currentIndex + 1} de {siblings.length}
              </p>
              <h1 className="text-xl md:text-2xl font-bold text-brand-text leading-snug">{lesson.title}</h1>
              <p className="text-brand-text-muted text-sm mt-1.5 flex items-center gap-1.5">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {lesson.duration_minutes} minutos
              </p>
            </div>

            <button
              onClick={toggleCompleted}
              disabled={savingProgress}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                completed
                  ? 'bg-brand-success/10 text-brand-success border border-brand-success/30 hover:bg-brand-success/15'
                  : 'bg-brand-blue hover:bg-brand-blue-hover text-white shadow-btn'
              }`}
            >
              {completed ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Concluída
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Marcar como concluída
                </>
              )}
            </button>
          </div>

          {lesson.description && (
            <div className="border-t border-brand-border pt-5 mb-6">
              <p className="text-brand-text-secondary text-sm leading-relaxed">{lesson.description}</p>
            </div>
          )}

          {/* Navegação */}
          <div className="grid grid-cols-2 gap-3 border-t border-brand-border pt-5">
            {prevLesson ? (
              <a
                href={'/aula/' + prevLesson.id}
                className="group flex flex-col gap-1.5 bg-white hover:bg-brand-sky border border-brand-border hover:border-brand-blue rounded-xl p-4 transition-all"
              >
                <span className="flex items-center gap-1 text-brand-text-muted text-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6"/>
                  </svg>
                  Anterior
                </span>
                <span className="text-brand-text-secondary text-sm font-medium group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                  {prevLesson.title}
                </span>
              </a>
            ) : <div />}

            {nextLesson ? (
              <a
                href={'/aula/' + nextLesson.id}
                className="group flex flex-col gap-1.5 bg-white hover:bg-brand-sky border border-brand-border hover:border-brand-blue rounded-xl p-4 transition-all text-right"
              >
                <span className="flex items-center gap-1 justify-end text-brand-text-muted text-xs">
                  Próxima
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6"/>
                  </svg>
                </span>
                <span className="text-brand-text-secondary text-sm font-medium group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">
                  {nextLesson.title}
                </span>
              </a>
            ) : <div />}
          </div>
        </div>

        {/* Sidebar desktop */}
        <aside className="hidden md:block w-72 flex-shrink-0 border-l border-brand-border bg-white">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            <div className="p-4 border-b border-brand-border">
              <h2 className="text-sm font-bold text-brand-text">Aulas do módulo</h2>
              <p className="text-xs text-brand-text-muted mt-0.5">{siblings.length} aulas</p>
            </div>
            <div className="p-2">
              {siblings.map((s, i) => {
                const isActive = s.id === lesson.id
                return (
                  <a
                    key={s.id}
                    href={'/aula/' + s.id}
                    className={`flex items-start gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all border ${
                      isActive
                        ? 'bg-brand-blue-soft border-brand-blue'
                        : 'border-transparent hover:bg-brand-sky hover:border-brand-border'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isActive ? 'bg-brand-blue text-white' : 'bg-brand-border text-brand-text-muted'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${isActive ? 'text-brand-blue' : 'text-brand-text-secondary'}`}>
                        {s.title}
                      </p>
                      <p className="text-brand-text-muted text-xs mt-0.5">{s.duration_minutes} min</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-brand-blue-dark/60 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div
            className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-brand-border overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-brand-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-brand-text">Aulas do módulo</h2>
                <p className="text-xs text-brand-text-muted mt-0.5">{siblings.length} aulas</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-brand-text-muted hover:text-brand-blue transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="p-2">
              {siblings.map((s, i) => {
                const isActive = s.id === lesson.id
                return (
                  <a
                    key={s.id}
                    href={'/aula/' + s.id}
                    className={`flex items-start gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all border ${
                      isActive
                        ? 'bg-brand-blue-soft border-brand-blue'
                        : 'border-transparent hover:bg-brand-sky hover:border-brand-border'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                      isActive ? 'bg-brand-blue text-white' : 'bg-brand-border text-brand-text-muted'
                    }`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${isActive ? 'text-brand-blue' : 'text-brand-text-secondary'}`}>
                        {s.title}
                      </p>
                      <p className="text-brand-text-muted text-xs mt-0.5">{s.duration_minutes} min</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
