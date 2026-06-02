'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'
import { Plane } from 'lucide-react'

const ADMIN_EMAIL = 'thamires.ferreirazampitravel@gmail.com'

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
  const [isAdmin, setIsAdmin]                 = useState(false)

  // ── Admin panel state ────────────────────────────────────────────────────
  const [adminOpen, setAdminOpen]             = useState(false)
  const [adminForm, setAdminForm]             = useState({ title: '', description: '', video_url: '', duration_minutes: 10 })
  const [adminSaving, setAdminSaving]         = useState(false)
  const [adminError, setAdminError]           = useState('')
  const [adminSuccess, setAdminSuccess]       = useState(false)
  const [uploading, setUploading]             = useState(false)
  const [uploadProgress, setUploadProgress]   = useState(0)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const admin = user.email === ADMIN_EMAIL
      setIsAdmin(admin)

      if (!admin) {
        const { data: access } = await supabase
          .from('user_access').select('id').eq('email', user.email!).single()
        if (!access) { window.location.href = '/pricing'; return }
      }

      const { data: lessonData } = await supabase
        .from('lessons').select('*').eq('id', params.id).single()
      if (!lessonData) { setLoading(false); return }
      setLesson(lessonData)
      setAdminForm({
        title:            lessonData.title ?? '',
        description:      lessonData.description ?? '',
        video_url:        lessonData.video_url ?? '',
        duration_minutes: lessonData.duration_minutes ?? 10,
      })

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

  // ── Auth token ───────────────────────────────────────────────────────────
  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return {}
    return { Authorization: `Bearer ${session.access_token}` }
  }

  // ── Upload de vídeo inline ───────────────────────────────────────────────
  async function handleVideoUpload(file: File) {
    setUploading(true)
    setUploadProgress(0)
    setAdminError('')
    try {
      const headers = await authHeaders()
      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })
      if (!res.ok) { const d = await res.json(); setAdminError(d.error || 'Erro ao iniciar upload'); return }
      const { signedUrl, publicUrl } = await res.json()

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => { if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100)) }
        xhr.onload  = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Erro ${xhr.status}`))
        xhr.onerror = () => reject(new Error('Erro de rede'))
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type)
        xhr.send(file)
      })

      setAdminForm(f => ({ ...f, video_url: publicUrl }))
    } catch (e: unknown) {
      setAdminError(e instanceof Error ? e.message : 'Erro ao enviar vídeo')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // ── Salvar edição da aula ────────────────────────────────────────────────
  async function saveAdminEdit() {
    if (!lesson) return
    setAdminSaving(true)
    setAdminError('')
    setAdminSuccess(false)
    try {
      const res = await fetch('/api/admin/lessons', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...await authHeaders() },
        body: JSON.stringify({ id: lesson.id, ...adminForm }),
      })
      if (!res.ok) { const d = await res.json(); setAdminError(d.error || 'Erro ao salvar'); return }
      setLesson(l => l ? { ...l, ...adminForm } : l)
      setAdminSuccess(true)
      setTimeout(() => setAdminSuccess(false), 3000)
    } catch {
      setAdminError('Erro ao salvar')
    } finally {
      setAdminSaving(false)
    }
  }

  // ── Progress ─────────────────────────────────────────────────────────────
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

  const currentIndex = siblings.findIndex((s) => s.id === lesson.id)
  const isYouTube    = lesson.video_url.includes('youtube.com') || lesson.video_url.includes('youtu.be')
  const embedUrl     = isYouTube
    ? lesson.video_url.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')
    : ''

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
            {/* Botão admin no header */}
            {isAdmin && (
              <button
                onClick={() => { setAdminOpen(true); setAdminError(''); setAdminSuccess(false) }}
                className="flex items-center gap-1.5 bg-amber-50 border border-amber-300 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
                Editar aula
              </button>
            )}

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
            {isYouTube ? (
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen />
            ) : lesson.video_url ? (
              <video
                src={lesson.video_url}
                controls
                controlsList="nodownload"
                className="w-full h-full"
                preload="metadata"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-white/40">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                </svg>
                <p className="text-sm">
                  {isAdmin ? 'Nenhum vídeo — clique em "Editar aula" para adicionar' : 'Vídeo não disponível'}
                </p>
              </div>
            )}
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
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  Concluída
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
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
              <a href={'/aula/' + prevLesson.id} className="group flex flex-col gap-1.5 bg-white hover:bg-brand-sky border border-brand-border hover:border-brand-blue rounded-xl p-4 transition-all">
                <span className="flex items-center gap-1 text-brand-text-muted text-xs">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                  Anterior
                </span>
                <span className="text-brand-text-secondary text-sm font-medium group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">{prevLesson.title}</span>
              </a>
            ) : <div />}

            {nextLesson ? (
              <a href={'/aula/' + nextLesson.id} className="group flex flex-col gap-1.5 bg-white hover:bg-brand-sky border border-brand-border hover:border-brand-blue rounded-xl p-4 transition-all text-right">
                <span className="flex items-center gap-1 justify-end text-brand-text-muted text-xs">
                  Próxima
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </span>
                <span className="text-brand-text-secondary text-sm font-medium group-hover:text-brand-blue transition-colors line-clamp-2 leading-snug">{nextLesson.title}</span>
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
                  <a key={s.id} href={'/aula/' + s.id} className={`flex items-start gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all border ${isActive ? 'bg-brand-blue-soft border-brand-blue' : 'border-transparent hover:bg-brand-sky hover:border-brand-border'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isActive ? 'bg-brand-blue text-white' : 'bg-brand-border text-brand-text-muted'}`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${isActive ? 'text-brand-blue' : 'text-brand-text-secondary'}`}>{s.title}</p>
                      <p className="text-brand-text-muted text-xs mt-0.5">{s.duration_minutes} min</p>
                    </div>
                  </a>
                )
              })}
            </div>

            {/* Link admin na sidebar */}
            {isAdmin && (
              <div className="p-3 border-t border-brand-border">
                <a href="/admin" className="flex items-center justify-center gap-2 text-xs text-brand-text-muted hover:text-brand-blue transition-colors py-2">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/></svg>
                  Painel Admin
                </a>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-brand-blue-dark/60 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white border-l border-brand-border overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 border-b border-brand-border flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-brand-text">Aulas do módulo</h2>
                <p className="text-xs text-brand-text-muted mt-0.5">{siblings.length} aulas</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-brand-text-muted hover:text-brand-blue transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className="p-2">
              {siblings.map((s, i) => {
                const isActive = s.id === lesson.id
                return (
                  <a key={s.id} href={'/aula/' + s.id} className={`flex items-start gap-3 px-3 py-3 rounded-xl mb-0.5 transition-all border ${isActive ? 'bg-brand-blue-soft border-brand-blue' : 'border-transparent hover:bg-brand-sky hover:border-brand-border'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isActive ? 'bg-brand-blue text-white' : 'bg-brand-border text-brand-text-muted'}`}>{i + 1}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium leading-snug ${isActive ? 'text-brand-blue' : 'text-brand-text-secondary'}`}>{s.title}</p>
                      <p className="text-brand-text-muted text-xs mt-0.5">{s.duration_minutes} min</p>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── PAINEL ADMIN (drawer lateral) ── */}
      {isAdmin && adminOpen && (
        <div style={{position:'fixed',inset:0,zIndex:50,display:'flex'}}>
          {/* Backdrop */}
          <div style={{flex:1,background:'rgba(0,0,0,0.4)'}} onClick={() => setAdminOpen(false)} />

          {/* Drawer */}
          <div style={{width:'100%',maxWidth:'384px',background:'white',boxShadow:'0 25px 50px rgba(0,0,0,0.25)',display:'flex',flexDirection:'column',height:'100%',overflowY:'auto'}}>
            {/* Header do painel */}
            <div className="sticky top-0 bg-amber-50 border-b border-amber-200 px-5 py-4 flex items-center justify-between z-10">
              <div>
                <p className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-0.5">Modo Admin</p>
                <h3 className="font-bold text-gray-900 text-sm">Editar esta aula</h3>
              </div>
              <button onClick={() => setAdminOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <div className="p-5 space-y-5 flex-1">
              {adminError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{adminError}</p>}
              {adminSuccess && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3">✓ Aula salva com sucesso!</p>}

              {/* Título */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Título</label>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  value={adminForm.title}
                  onChange={e => setAdminForm(f => ({ ...f, title: e.target.value }))}
                />
              </div>

              {/* Descrição */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Descrição</label>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent resize-none"
                  rows={3}
                  value={adminForm.description}
                  onChange={e => setAdminForm(f => ({ ...f, description: e.target.value }))}
                />
              </div>

              {/* Vídeo */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Vídeo</label>

                {adminForm.video_url && adminForm.video_url.length > 0 ? (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                    </svg>
                    <span className="text-xs text-green-700 flex-1 truncate">
                      {adminForm.video_url.includes('supabase') ? '✓ Vídeo enviado' : adminForm.video_url}
                    </span>
                    <button type="button" onClick={() => setAdminForm(f => ({ ...f, video_url: '' }))} className="text-xs text-red-500 hover:text-red-700 flex-shrink-0">
                      Trocar
                    </button>
                  </div>
                ) : uploading ? (
                  <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-xs text-blue-700 mb-1.5">
                      <span>Enviando vídeo...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span className="text-sm text-gray-500">Clique para enviar vídeo</span>
                      <input type="file" accept="video/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) handleVideoUpload(f); e.target.value = '' }} />
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">ou cole URL</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <input
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                      value={adminForm.video_url}
                      onChange={e => setAdminForm(f => ({ ...f, video_url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}
              </div>

              {/* Duração */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Duração (minutos)</label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  value={adminForm.duration_minutes}
                  onChange={e => setAdminForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))}
                />
              </div>
            </div>

            {/* Footer fixo */}
            <div className="sticky bottom-0 bg-white border-t p-4 flex flex-col gap-2">
              <button
                onClick={saveAdminEdit}
                disabled={adminSaving || uploading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                {adminSaving ? 'Salvando...' : '💾 Salvar alterações'}
              </button>
              <a
                href="/admin"
                className="w-full text-center text-xs text-gray-500 hover:text-gray-700 py-1.5 transition-colors"
              >
                Ir para o Painel Admin completo →
              </a>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
