'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Student {
  id: string
  email: string
  stripe_session_id: string
  created_at: string
}

interface Module {
  id: string
  title: string
  description: string
  thumbnail_url: string
  order_index: number
  is_published: boolean
}

interface Lesson {
  id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  module_id: string
  order_index: number
  is_published: boolean
  is_preview: boolean
  modules?: { title: string }
}

const emptyModule: Omit<Module, 'id'> = {
  title: '',
  description: '',
  thumbnail_url: '',
  order_index: 1,
  is_published: true,
}

const emptyLesson: Omit<Lesson, 'id' | 'modules'> = {
  title: '',
  description: '',
  video_url: '',
  duration_minutes: 10,
  module_id: '',
  order_index: 1,
  is_published: true,
  is_preview: false,
}

export default function AdminPage() {
  const [tab, setTab] = useState<'modulos' | 'aulas' | 'alunos'>('aulas')
  const [modules, setModules] = useState<Module[]>([])
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [newStudentEmail, setNewStudentEmail] = useState('')
  const [addingStudent, setAddingStudent] = useState(false)
  const [studentError, setStudentError] = useState('')

  const [moduleForm, setModuleForm] = useState<Partial<Module>>(emptyModule)
  const [lessonForm, setLessonForm] = useState<Partial<Lesson>>(emptyLesson)

  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)

  const [showModuleForm, setShowModuleForm] = useState(false)
  const [showLessonForm, setShowLessonForm] = useState(false)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [pageError, setPageError] = useState('')

  async function authHeaders(): Promise<Record<string, string>> {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.access_token) return {}
    return { Authorization: `Bearer ${session.access_token}` }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPageError('Tempo esgotado ao conectar. Recarregue a página ou faça login novamente.')
      setLoading(false)
    }, 8000)

    async function check() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        clearTimeout(timeout)
        if (!user) { window.location.href = '/login'; return }
        await fetchAll()
      } catch (e) {
        clearTimeout(timeout)
        setPageError('Erro ao verificar sessão: ' + String(e))
        setLoading(false)
      }
    }
    check()

    return () => clearTimeout(timeout)
  }, [])

  async function fetchAll() {
    setLoading(true)
    try {
      const headers = await authHeaders()
      const [modRes, lesRes, stuRes] = await Promise.all([
        fetch('/api/admin/modules', { headers }),
        fetch('/api/admin/lessons', { headers }),
        fetch('/api/admin/students', { headers }),
      ])
      if (modRes.status === 401) { window.location.href = '/dashboard'; return }
      if (modRes.ok) setModules(await modRes.json())
      if (lesRes.ok) setLessons(await lesRes.json())
      if (stuRes.ok) setStudents(await stuRes.json())
    } catch (e) {
      console.error('fetchAll error:', e)
      setPageError(String(e))
    } finally {
      setLoading(false)
    }
  }

  // ── Módulos ──────────────────────────────────────────────────────────────

  function openNewModule() {
    setEditingModuleId(null)
    setModuleForm(emptyModule)
    setShowModuleForm(true)
    setError('')
  }

  function openEditModule(mod: Module) {
    setEditingModuleId(mod.id)
    setModuleForm(mod)
    setShowModuleForm(true)
    setError('')
  }

  async function saveModule() {
    setSaving(true)
    setError('')
    const method = editingModuleId ? 'PUT' : 'POST'
    const body = editingModuleId ? { ...moduleForm, id: editingModuleId } : moduleForm
    const res = await fetch('/api/admin/modules', {
      method,
      headers: { 'Content-Type': 'application/json', ...await authHeaders() },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Erro ao salvar')
    } else {
      setShowModuleForm(false)
      await fetchAll()
    }
    setSaving(false)
  }

  async function deleteModule(id: string) {
    if (!confirm('Excluir módulo? As aulas do módulo também serão removidas.')) return
    await fetch('/api/admin/modules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...await authHeaders() },
      body: JSON.stringify({ id }),
    })
    await fetchAll()
  }

  // ── Aulas ─────────────────────────────────────────────────────────────────

  function openNewLesson(moduleId?: string) {
    setEditingLessonId(null)
    setLessonForm({ ...emptyLesson, module_id: moduleId ?? '' })
    setShowLessonForm(true)
    setError('')
  }

  function openEditLesson(lesson: Lesson) {
    setEditingLessonId(lesson.id)
    setLessonForm(lesson)
    setShowLessonForm(true)
    setError('')
  }

  async function saveLesson() {
    setSaving(true)
    setError('')
    const method = editingLessonId ? 'PUT' : 'POST'
    const { modules: _, ...formData } = lessonForm as Lesson
    const body = editingLessonId ? { ...formData, id: editingLessonId } : formData
    const res = await fetch('/api/admin/lessons', {
      method,
      headers: { 'Content-Type': 'application/json', ...await authHeaders() },
      body: JSON.stringify(body),
    })
    if (!res.ok) {
      const d = await res.json()
      setError(d.error || 'Erro ao salvar')
    } else {
      setShowLessonForm(false)
      await fetchAll()
    }
    setSaving(false)
  }

  async function deleteLesson(id: string) {
    if (!confirm('Excluir aula?')) return
    await fetch('/api/admin/lessons', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...await authHeaders() },
      body: JSON.stringify({ id }),
    })
    await fetchAll()
  }

  // ── Upload de vídeo ───────────────────────────────────────────────────────

  async function handleVideoUpload(file: File) {
    setUploading(true)
    setUploadProgress(0)
    setError('')
    try {
      const headers = await authHeaders()

      // Passo 1: pede URL assinada ao servidor
      const res = await fetch('/api/admin/upload-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ filename: file.name, contentType: file.type }),
      })
      if (!res.ok) {
        const d = await res.json()
        setError(d.error || 'Erro ao iniciar upload')
        return
      }
      const { signedUrl, publicUrl } = await res.json()

      // Passo 2: envia o arquivo diretamente ao Supabase via XHR (com barra de progresso)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            setUploadProgress(Math.round((e.loaded / e.total) * 100))
          }
        }
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) resolve()
          else if (xhr.status === 413) reject(new Error('Arquivo muito grande. Aumente o limite no bucket do Supabase ou use um vídeo menor.'))
          else reject(new Error(`Upload falhou (${xhr.status}): ${xhr.responseText}`))
        }
        xhr.onerror = () => reject(new Error('Erro de rede durante o upload'))
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', file.type || 'video/mp4')
        xhr.send(file)
      })

      setLessonForm(f => ({ ...f, video_url: publicUrl }))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Erro ao enviar vídeo. Tente novamente.')
      console.error(e)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  // ── Alunos ────────────────────────────────────────────────────────────────

  async function addStudent() {
    if (!newStudentEmail.trim()) return
    setAddingStudent(true)
    setStudentError('')
    const res = await fetch('/api/admin/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...await authHeaders() },
      body: JSON.stringify({ email: newStudentEmail.trim() }),
    })
    if (!res.ok) {
      const d = await res.json()
      setStudentError(d.error || 'Erro ao adicionar')
    } else {
      setNewStudentEmail('')
      await fetchAll()
    }
    setAddingStudent(false)
  }

  async function revokeStudent(email: string) {
    if (!confirm(`Revogar acesso de ${email}?`)) return
    await fetch('/api/admin/students', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...await authHeaders() },
      body: JSON.stringify({ email }),
    })
    await fetchAll()
  }

  if (loading) {
    return <main className="min-h-screen bg-gray-50 flex items-center justify-center"><p className="text-gray-500">Carregando...</p></main>
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-lg font-bold text-blue-600">Admin — Milhas Club</h1>
          <a href="/dashboard" className="text-sm text-gray-500 hover:text-gray-700">← Dashboard</a>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Erro de carregamento */}
        {pageError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            <strong>Erro:</strong> {pageError}
          </div>
        )}
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b">
          {([
            { key: 'aulas', label: 'Aulas' },
            { key: 'modulos', label: 'Módulos' },
            { key: 'alunos', label: `Alunos (${students.length})` },
          ] as { key: 'aulas' | 'modulos' | 'alunos'; label: string }[]).map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── ABA AULAS ── */}
        {tab === 'aulas' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Aulas ({lessons.length})</h2>
              <button onClick={() => openNewLesson()} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
                + Nova aula
              </button>
            </div>

            {modules.map(mod => {
              const modLessons = lessons.filter(l => l.module_id === mod.id)
              return (
                <div key={mod.id} className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{mod.title}</h3>
                    <button onClick={() => openNewLesson(mod.id)} className="text-xs text-blue-600 hover:underline">+ aula neste módulo</button>
                  </div>
                  {modLessons.length === 0 && (
                    <p className="text-xs text-gray-400 mb-2">Nenhuma aula ainda.</p>
                  )}
                  <div className="space-y-2">
                    {modLessons.map((lesson, i) => (
                      <div key={lesson.id} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-xs flex items-center justify-center font-bold flex-shrink-0">{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{lesson.title}</p>
                          <p className="text-xs text-gray-400">{lesson.duration_minutes} min · {lesson.is_published ? 'Publicada' : 'Rascunho'}{lesson.is_preview ? ' · Preview' : ''}</p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <button onClick={() => openEditLesson(lesson)} className="text-xs text-blue-600 hover:underline">Editar</button>
                          <button onClick={() => deleteLesson(lesson.id)} className="text-xs text-red-500 hover:underline">Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}

            {/* Aulas sem módulo */}
            {(() => {
              const orphans = lessons.filter(l => !modules.find(m => m.id === l.module_id))
              if (!orphans.length) return null
              return (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Sem módulo</h3>
                  <div className="space-y-2">
                    {orphans.map(lesson => (
                      <div key={lesson.id} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{lesson.title}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEditLesson(lesson)} className="text-xs text-blue-600 hover:underline">Editar</button>
                          <button onClick={() => deleteLesson(lesson.id)} className="text-xs text-red-500 hover:underline">Excluir</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}

        {/* ── ABA MÓDULOS ── */}
        {tab === 'modulos' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Módulos ({modules.length})</h2>
              <button onClick={openNewModule} className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700">
                + Novo módulo
              </button>
            </div>
            <div className="space-y-3">
              {modules.map(mod => (
                <div key={mod.id} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-4">
                  {mod.thumbnail_url && <img src={mod.thumbnail_url} alt="" className="w-16 h-12 object-cover rounded flex-shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm">{mod.title}</p>
                    <p className="text-xs text-gray-400 truncate">{mod.description}</p>
                    <p className="text-xs text-gray-400">Ordem: {mod.order_index} · {mod.is_published ? 'Publicado' : 'Rascunho'}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => openEditModule(mod)} className="text-xs text-blue-600 hover:underline">Editar</button>
                    <button onClick={() => deleteModule(mod.id)} className="text-xs text-red-500 hover:underline">Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* ── ABA ALUNOS ── */}
        {tab === 'alunos' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Alunos com acesso ({students.length})</h2>
            </div>

            {/* Adicionar manualmente */}
            <div className="bg-white rounded-lg border p-4 mb-6">
              <p className="text-sm font-medium text-gray-700 mb-2">Liberar acesso manualmente</p>
              {studentError && <p className="text-sm text-red-600 bg-red-50 rounded p-2 mb-2">{studentError}</p>}
              <div className="flex gap-2">
                <input
                  className={`${input} flex-1`}
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newStudentEmail}
                  onChange={e => setNewStudentEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addStudent()}
                />
                <button
                  onClick={addStudent}
                  disabled={addingStudent || !newStudentEmail.trim()}
                  className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
                >
                  {addingStudent ? 'Adicionando...' : 'Liberar'}
                </button>
              </div>
            </div>

            {/* Lista de alunos */}
            {students.length === 0 ? (
              <p className="text-sm text-gray-400">Nenhum aluno com acesso ainda.</p>
            ) : (
              <div className="space-y-2">
                {students.map(s => (
                  <div key={s.id} className="bg-white rounded-lg border px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{s.email}</p>
                      <p className="text-xs text-gray-400">
                        {s.stripe_session_id === 'manual' ? 'Acesso manual' : 'Via Stripe'} ·{' '}
                        {new Date(s.created_at).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <button
                      onClick={() => revokeStudent(s.email)}
                      className="text-xs text-red-500 hover:underline flex-shrink-0"
                    >
                      Revogar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── MODAL MÓDULO ── */}
      {showModuleForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'16px'}}>
          <div style={{background:'white',borderRadius:'12px',width:'100%',maxWidth:'448px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <div className="p-5 border-b flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{editingModuleId ? 'Editar módulo' : 'Novo módulo'}</h3>
              <button onClick={() => setShowModuleForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}
              <Field label="Título" required>
                <input className={input} value={moduleForm.title ?? ''} onChange={e => setModuleForm(f => ({ ...f, title: e.target.value }))} />
              </Field>
              <Field label="Descrição">
                <textarea className={`${input} resize-none`} rows={2} value={moduleForm.description ?? ''} onChange={e => setModuleForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
              <Field label="URL da thumbnail">
                <input className={input} value={moduleForm.thumbnail_url ?? ''} onChange={e => setModuleForm(f => ({ ...f, thumbnail_url: e.target.value }))} placeholder="https://..." />
              </Field>
              <Field label="Ordem">
                <input type="number" className={input} value={moduleForm.order_index ?? 1} onChange={e => setModuleForm(f => ({ ...f, order_index: Number(e.target.value) }))} />
              </Field>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input type="checkbox" checked={moduleForm.is_published ?? true} onChange={e => setModuleForm(f => ({ ...f, is_published: e.target.checked }))} />
                Publicado
              </label>
            </div>
            <div className="p-5 border-t flex justify-end gap-2">
              <button onClick={() => setShowModuleForm(false)} className="text-sm text-gray-500 px-4 py-2 hover:text-gray-700">Cancelar</button>
              <button onClick={saveModule} disabled={saving} className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL AULA ── */}
      {showLessonForm && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:1000,padding:'16px'}}>
          <div style={{background:'white',borderRadius:'12px',width:'100%',maxWidth:'448px',maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,0.3)'}}>
            <div className="p-5 border-b flex justify-between items-center sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">{editingLessonId ? 'Editar aula' : 'Nova aula'}</h3>
              <button onClick={() => setShowLessonForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-5 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 rounded p-2">{error}</p>}
              <Field label="Módulo" required>
                <select className={input} value={lessonForm.module_id ?? ''} onChange={e => setLessonForm(f => ({ ...f, module_id: e.target.value }))}>
                  <option value="">Selecione um módulo</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </Field>
              <Field label="Título" required>
                <input className={input} value={lessonForm.title ?? ''} onChange={e => setLessonForm(f => ({ ...f, title: e.target.value }))} />
              </Field>
              <Field label="Descrição">
                <textarea className={`${input} resize-none`} rows={3} value={lessonForm.description ?? ''} onChange={e => setLessonForm(f => ({ ...f, description: e.target.value }))} />
              </Field>
              <Field label="Vídeo da aula" required>
                {lessonForm.video_url && lessonForm.video_url.length > 0 ? (
                  /* Vídeo já definido */
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.41 19.1C5.12 19.56 12 19.56 12 19.56s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/>
                    </svg>
                    <span className="text-xs text-green-700 flex-1 truncate" title={lessonForm.video_url}>
                      {(lessonForm.video_url ?? '').includes('supabase') ? '✓ Vídeo enviado' : lessonForm.video_url}
                    </span>
                    <button
                      type="button"
                      onClick={() => setLessonForm(f => ({ ...f, video_url: '' }))}
                      className="text-xs text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      Remover
                    </button>
                  </div>
                ) : uploading ? (
                  /* Enviando... */
                  <div className="p-3 border border-blue-200 bg-blue-50 rounded-lg">
                    <div className="flex justify-between text-xs text-blue-700 mb-1.5">
                      <span>Enviando vídeo...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  /* Sem vídeo — upload ou URL */
                  <div className="space-y-2">
                    <label className="flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all">
                      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                      <span className="text-sm text-gray-500">Clique para enviar arquivo de vídeo</span>
                      <input
                        type="file"
                        accept="video/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (file) handleVideoUpload(file)
                          e.target.value = ''
                        }}
                      />
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400">ou cole uma URL (YouTube etc.)</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <input
                      className={input}
                      value={lessonForm.video_url ?? ''}
                      onChange={e => setLessonForm(f => ({ ...f, video_url: e.target.value }))}
                      placeholder="https://www.youtube.com/watch?v=..."
                    />
                  </div>
                )}
              </Field>
              <Field label="Duração (minutos)">
                <input type="number" className={input} value={lessonForm.duration_minutes ?? 10} onChange={e => setLessonForm(f => ({ ...f, duration_minutes: Number(e.target.value) }))} />
              </Field>
              <Field label="Ordem">
                <input type="number" className={input} value={lessonForm.order_index ?? 1} onChange={e => setLessonForm(f => ({ ...f, order_index: Number(e.target.value) }))} />
              </Field>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={lessonForm.is_published ?? true} onChange={e => setLessonForm(f => ({ ...f, is_published: e.target.checked }))} />
                  Publicada
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input type="checkbox" checked={lessonForm.is_preview ?? false} onChange={e => setLessonForm(f => ({ ...f, is_preview: e.target.checked }))} />
                  Preview gratuito
                </label>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
              <button onClick={() => setShowLessonForm(false)} className="text-sm text-gray-500 px-4 py-2 hover:text-gray-700">Cancelar</button>
              <button onClick={saveLesson} disabled={saving} className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
