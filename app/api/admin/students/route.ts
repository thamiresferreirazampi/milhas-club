import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

async function getUser(req: NextRequest) {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) return null
  const token = auth.slice(7)
  const { data: { user } } = await supabaseAdmin.auth.getUser(token)
  return user
}

function isAdmin(email: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  return adminEmail ? email === adminEmail : true
}

export async function GET(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !isAdmin(user.email!)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('user_access')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !isAdmin(user.email!)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { email } = await req.json()
  if (!email) return NextResponse.json({ error: 'Email obrigatório' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('user_access')
    .insert({ email, stripe_session_id: 'manual' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !isAdmin(user.email!)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { email } = await req.json()
  const { error } = await supabaseAdmin.from('user_access').delete().eq('email', email)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
