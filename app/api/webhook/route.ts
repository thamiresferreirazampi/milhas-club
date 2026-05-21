import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabaseAdmin } from '@/lib/supabase-admin'

const stripe = new Stripe((process.env.STRIPE_SECRET_KEY ?? '').trim(), {
  apiVersion: '2026-04-22.dahlia',
  httpClient: Stripe.createFetchHttpClient(),
})

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      (process.env.STRIPE_WEBHOOK_SECRET ?? '').trim()
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const email = session.customer_details?.email ?? session.customer_email

    console.log('Webhook recebido - email:', email, 'session_id:', session.id)

    if (email) {
      const { data, error, status, statusText } = await supabaseAdmin
        .from('user_access')
        .upsert({ email, stripe_session_id: session.id }, { onConflict: 'email' })
        .select()
      console.log('Supabase upsert - data:', JSON.stringify(data), 'erro:', JSON.stringify(error), 'status:', status, statusText)
    } else {
      console.log('Email nulo - nenhum acesso liberado')
    }
  }

  return NextResponse.json({ received: true })
}
