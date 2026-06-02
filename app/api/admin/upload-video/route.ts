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
  return email === 'thamires.ferreirazampitravel@gmail.com'
}

// POST — gera URL assinada para upload direto no Storage
export async function POST(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !isAdmin(user.email!)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { filename, contentType } = await req.json()
  if (!filename) return NextResponse.json({ error: 'filename obrigatório' }, { status: 400 })

  // Sanitiza o nome do arquivo
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `lessons/${Date.now()}-${safeName}`

  const { data, error } = await supabaseAdmin.storage
    .from('VIDEOS')
    .createSignedUploadUrl(path)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabaseAdmin.storage.from('VIDEOS').getPublicUrl(path)

  return NextResponse.json({
    signedUrl: data.signedUrl,
    token: data.token,
    path,
    publicUrl,
  })
}

// DELETE — remove vídeo do Storage ao deletar/substituir aula
export async function DELETE(req: NextRequest) {
  const user = await getUser(req)
  if (!user || !isAdmin(user.email!)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { path } = await req.json()
  if (!path) return NextResponse.json({ error: 'path obrigatório' }, { status: 400 })

  const { error } = await supabaseAdmin.storage.from('VIDEOS').remove([path])
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
