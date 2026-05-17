'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

interface Module {
  id: string
  title: string
}

export default function CertificadoPage() {
  const params = useParams()
  const [userName, setUserName] = useState('')
  const [module, setModule] = useState<Module | null>(null)
  const [eligible, setEligible] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: access } = await supabase
        .from('user_access')
        .select('id')
        .eq('email', user.email!)
        .single()
      if (!access) { window.location.href = '/pricing'; return }

      const [{ data: moduleData }, { data: lessons }] = await Promise.all([
        supabase.from('modules').select('id, title').eq('id', params.moduleId).single(),
        supabase.from('lessons').select('id').eq('module_id', params.moduleId).eq('is_published', true),
      ])

      if (!moduleData || !lessons || lessons.length === 0) {
        setLoading(false)
        return
      }

      const { data: progress } = await supabase
        .from('lesson_progress')
        .select('lesson_id')
        .eq('user_id', user.id)
        .in('lesson_id', lessons.map((l: { id: string }) => l.id))

      const completed = (progress ?? []).length === lessons.length

      setModule(moduleData)
      setEligible(completed)
      setUserName(user.email?.split('@')[0] ?? 'Aluno')
      setLoading(false)
    }
    load()
  }, [params.moduleId])

  if (loading) {
    return <main className="min-h-screen bg-blue-50 flex items-center justify-center"><p className="text-gray-500">Carregando...</p></main>
  }

  if (!eligible) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Certificado não disponível</h1>
          <p className="text-gray-500 text-sm mb-6">Conclua todas as aulas do módulo para liberar o certificado.</p>
          <a href={`/modulo/${params.moduleId}`} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700">
            Continuar estudando
          </a>
        </div>
      </main>
    )
  }

  const today = new Date().toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 py-10 print:bg-white print:p-0">
      {/* Controles — ocultos na impressão */}
      <div className="flex gap-3 mb-6 print:hidden">
        <a href="/dashboard" className="text-sm text-gray-500 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50">
          ← Dashboard
        </a>
        <button
          onClick={() => window.print()}
          className="bg-blue-600 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Imprimir / Salvar PDF
        </button>
      </div>

      {/* Certificado */}
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-xl print:shadow-none print:rounded-none print:max-w-none overflow-hidden">
        {/* Borda decorativa superior */}
        <div className="h-3 bg-gradient-to-r from-pink-400 via-blue-500 to-pink-400" />

        <div className="px-12 py-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Certificado de Conclusão</p>

          <div className="text-5xl mb-4">✈️</div>
          <h1 className="text-2xl font-bold text-pink-600 mb-1">Milhas Club</h1>
          <p className="text-gray-400 text-sm mb-10">Programa de Educação em Milhas e Viagens</p>

          <p className="text-gray-600 text-sm mb-2">Certificamos que</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{userName}</h2>
          <p className="text-gray-600 text-sm mb-8">concluiu com êxito o módulo</p>

          <div className="bg-blue-50 rounded-xl px-8 py-4 inline-block mb-8">
            <p className="text-xl font-bold text-blue-700">{module?.title}</p>
          </div>

          <p className="text-gray-500 text-sm mb-10">
            Cumprindo todos os requisitos e completando todas as aulas do programa.
          </p>

          <div className="border-t pt-8 flex justify-center gap-16">
            <div className="text-center">
              <p className="font-bold text-gray-700 text-sm">Milhas Club</p>
              <p className="text-gray-400 text-xs mt-1">Plataforma de Ensino</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-gray-700 text-sm">{today}</p>
              <p className="text-gray-400 text-xs mt-1">Data de conclusão</p>
            </div>
          </div>
        </div>

        {/* Borda decorativa inferior */}
        <div className="h-3 bg-gradient-to-r from-pink-400 via-blue-500 to-pink-400" />
      </div>
    </main>
  )
}
