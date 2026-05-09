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
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.href = '/login'
        return
      }
      setUser(user)
      const { data: modulesData } = await supabase
        .from('modules')
        .select('*')
        .eq('is_published', true)
        .order('order_index')
      if (modulesData) {
        setModules(modulesData)
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
      <main className="min-h-screen bg-pink-50 flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-pink-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-pink-600">Milhas Club</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button onClick={handleLogout} className="text-gray-500">Sair</button>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Seus Modulos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <a key={mod.id} href={'/modulo/' + mod.id} className="bg-white rounded-xl overflow-hidden shadow-md">
              <img src={mod.thumbnail_url} alt={mod.title} className="w-full h-40 object-cover" />
              <div className="p-4">
                <h3 className="font-bold text-gray-900 mb-2">{mod.title}</h3>
                <p className="text-gray-600 text-sm">{mod.description}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  )
}