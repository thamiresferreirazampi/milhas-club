import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } }
  )
}

export async function GET(req: NextRequest) {
  const client = await getClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const moduleId = req.nextUrl.searchParams.get('module_id')

  let query = client.from('lesson_progress').select('lesson_id').eq('user_id', user.id)
  if (moduleId) {
    const { data: lessonIds } = await client
      .from('lessons')
      .select('id')
      .eq('module_id', moduleId)
    const ids = (lessonIds ?? []).map((l: { id: string }) => l.id)
    query = query.in('lesson_id', ids)
  }

  const { data } = await query
  return NextResponse.json((data ?? []).map((r: { lesson_id: string }) => r.lesson_id))
}

export async function POST(req: NextRequest) {
  const client = await getClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { lesson_id } = await req.json()
  await client
    .from('lesson_progress')
    .upsert({ user_id: user.id, lesson_id }, { onConflict: 'user_id,lesson_id' })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const client = await getClient()
  const { data: { user } } = await client.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const { lesson_id } = await req.json()
  await client
    .from('lesson_progress')
    .delete()
    .eq('user_id', user.id)
    .eq('lesson_id', lesson_id)

  return NextResponse.json({ ok: true })
}
