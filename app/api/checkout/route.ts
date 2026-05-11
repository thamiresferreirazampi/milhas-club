import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-04-22.dahlia'
})

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID!,
          quantity: 1,
        },
      ],
      success_url: process.env.NEXT_PUBLIC_APP_URL + '/sucesso',
      cancel_url: process.env.NEXT_PUBLIC_APP_URL + '/pricing',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erro ao criar checkout:', error)
    return NextResponse.json({ error: 'Erro ao criar checkout' }, { status: 500 })
  }
}