'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

interface Lesson {
  id: string
  title: string
  description: string
  video_url: string
  duration_minutes: number
  module_id: string
}

export default function AulaPage() {
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: lessonData } = await supabase
        .from('lessons')
        .select('*')
        .eq('id', params.id)
        .single()

      if (lessonData) {
        setLesson(lessonData)
      }

      setLoading(false)
    }
    loadData()
  }, [params.id])

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Carregando...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900">
      <header className="bg-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/dashboard" className="text-2xl font-bold text-pink-500">Milhas Club</a>
          <a href={'/modulo/' + lesson?.module_id} className="text-gray-400 hover:text-white">← Voltar ao modulo</a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-black rounded-xl overflow-hidden mb-6 aspect-video">
          <iframe
            src={lesson?.video_url.replace('watch?v=', 'embed/')}
            className="w-full h-full"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">{lesson?.title}</h1>
        <p className="text-gray-400 mb-4">{lesson?.duration_minutes} minutos</p>
        <p className="text-gray-300">{lesson?.description}</p>
      </div>
    </main>
  )
}