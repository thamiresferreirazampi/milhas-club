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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: moduleData } = await supabase
        .from('modules')
        .select('*')
        .eq('id', params.id)
        .single()

      if (moduleData) {
        setModule(moduleData)
      }

      const { data: lessonsData } = await supabase
        .from('lessons')
        .select('*')
        .eq('module_id', params.id)
        .eq('is_published', true)
        .order('order_index')

      if (lessonsData) {
        setLessons(lessonsData)
      }
      setLoading(false)
    }
    loadData()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <a href="/dashboard" className="text-xl font-bold text-primary-600">✈️ Milhas Club</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <a href="/dashboard" className="text-primary-500 text-sm mb-4 inline-block">← Voltar</a>
        
        <div className="bg-white rounded-lg overflow-hidden shadow mb-6">
          <img src={module?.thumbnail_url} alt={module?.title} className="w-full h-36 object-cover" />
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-900 mb-2">{module?.title}</h1>
            <p className="text-gray-600 text-sm">{module?.description}</p>
          </div>
        </div>

        <h2 className="text-lg font-bold text-gray-900 mb-3">Aulas</h2>
        
        <div className="space-y-3">
          {lessons.map((lesson, index) => (
            <a 
              key={lesson.id} 
              href={'/aula/' + lesson.id} 
              className="bg-white rounded-lg p-3 shadow flex items-center gap-3 hover:shadow-md transition-shadow"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-sm">
                {index + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">{lesson.title}</h3>
                <p className="text-gray-500 text-xs">{lesson.duration_minutes} min</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}