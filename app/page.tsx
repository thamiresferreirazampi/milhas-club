'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Plane, Users, TrendingUp, BadgeDollarSign,
  Target, Map, Lightbulb, Check,
  ChevronDown, ArrowRight, Sparkles, Shield,
  Star, CreditCard, Hotel, Ticket,
} from 'lucide-react'
import { useState } from 'react'

/* ─── Animation variants ─────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={stagger}
    >
      {children}
    </motion.section>
  )
}

/* ─── Dashboard Mockup ───────────────────────────────── */
function DashboardMockup() {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Browser chrome */}
      <div className="bg-gray-50 px-4 py-3 flex items-center gap-3 border-b border-gray-100">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-[10px] text-gray-400 text-center border border-gray-100 font-mono">
          milhas-club.vercel.app/dashboard
        </div>
      </div>
      {/* Simulated dashboard UI */}
      <div className="bg-[#f8f9fb] p-4 space-y-3">
        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-[10px] text-pink-200 mb-1">Bem-vinda de volta</div>
              <div className="font-bold text-sm">Ana ✈</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">A</div>
          </div>
          <div className="text-[10px] text-pink-100 mb-1.5">Progresso geral · 64%</div>
          <div className="h-1.5 bg-white/20 rounded-full">
            <div className="h-1.5 bg-white rounded-full w-[64%]" />
          </div>
        </div>
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Módulos', value: '6' },
            { label: 'Em progresso', value: '2' },
            { label: 'Concluídos', value: '4', green: true },
          ].map((s) => (
            <div key={s.label} className={`rounded-lg p-2 text-center border ${s.green ? 'bg-green-50 border-green-100' : 'bg-white border-gray-100'}`}>
              <div className={`font-extrabold text-sm ${s.green ? 'text-green-600' : 'text-gray-800'}`}>{s.value}</div>
              <div className="text-[9px] text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
        {/* Module cards */}
        <div className="text-[10px] font-bold text-gray-500 px-0.5">Seus Módulos</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { title: 'Fundamentos', pct: 100, done: true },
            { title: 'Cartões certos', pct: 80, done: false },
            { title: 'Emissão nacional', pct: 60, done: false },
            { title: 'Voos internacionais', pct: 20, done: false },
          ].map((m) => (
            <div key={m.title} className="bg-white rounded-lg p-2.5 border border-gray-100">
              <div className="h-8 rounded-md bg-gradient-to-br from-pink-50 to-rose-50 mb-2" />
              <div className="text-[9px] font-bold text-gray-700 mb-1.5 truncate">{m.title}</div>
              <div className="flex items-center justify-between text-[8px] text-gray-400 mb-1">
                <span>{m.pct}%</span>
              </div>
              <div className="h-1 bg-gray-100 rounded-full">
                <div
                  className={`h-1 rounded-full ${m.done ? 'bg-green-400' : 'bg-pink-400'}`}
                  style={{ width: `${m.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Hero Mockup Column ─────────────────────────────── */
function HeroMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto lg:mx-0 mt-12 lg:mt-0">
      {/* Glow behind */}
      <div className="absolute inset-4 bg-gradient-to-br from-pink-300 to-rose-300 rounded-3xl blur-3xl opacity-25 pointer-events-none" />

      {/* Floating card — top left */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-5 -left-5 z-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-gray-100"
      >
        <div className="w-8 h-8 bg-pink-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Users className="w-4 h-4 text-pink-500" />
        </div>
        <div>
          <p className="text-xs font-extrabold text-gray-900 leading-none">5.000+</p>
          <p className="text-[10px] text-gray-400 mt-0.5">alunos</p>
        </div>
      </motion.div>

      {/* Floating card — top right */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        className="absolute -top-3 -right-5 z-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2.5 border border-gray-100"
      >
        <div className="w-8 h-8 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0 text-base">✈️</div>
        <div>
          <p className="text-xs font-extrabold text-gray-900 leading-none">100M+</p>
          <p className="text-[10px] text-gray-400 mt-0.5">milhas emitidas</p>
        </div>
      </motion.div>

      {/* Main mockup */}
      <div className="relative z-10">
        <DashboardMockup />
      </div>

      {/* Floating card — bottom left */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        className="absolute -bottom-5 -left-5 z-20 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0 text-base">✈️</div>
          <div>
            <p className="text-xs font-extrabold text-gray-900 leading-none">22.000 milhas</p>
            <p className="text-[10px] text-gray-400 mt-0.5">Passagem p/ Orlando</p>
          </div>
        </div>
      </motion.div>

      {/* Floating card — bottom right */}
      <motion.div
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        className="absolute -bottom-3 -right-5 z-20 bg-white rounded-2xl shadow-xl p-3 border border-gray-100"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <BadgeDollarSign className="w-4 h-4 text-green-500" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-green-600 leading-none">R$ 4.850</p>
            <p className="text-[10px] text-gray-400 mt-0.5">economizados</p>
          </div>
        </div>
      </motion.div>

      {/* Floating card — mid right */}
      <motion.div
        animate={{ x: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        className="absolute top-1/2 -translate-y-1/2 -right-8 z-20 bg-white rounded-2xl shadow-xl p-3 border border-gray-100 hidden lg:flex items-center gap-2"
      >
        <div className="flex">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-700">4.9/5</p>
      </motion.div>
    </div>
  )
}

/* ─── Page ───────────────────────────────────────────── */
export default function Home() {
  return (
    <main className="min-h-screen bg-[#fdf8f6] overflow-x-hidden">

      {/* Announcement bar */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white text-center text-xs font-semibold py-2.5 px-4 tracking-wide">
        🔥 Oferta por tempo limitado — 60% OFF · De R$&nbsp;497 por apenas R$&nbsp;197
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2">
            <Plane className="text-pink-500 w-5 h-5" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">Milhas Club</span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-gray-500 text-sm hover:text-gray-800 transition-colors hidden sm:block">Entrar</a>
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-pink-500 hover:bg-pink-600 text-white px-5 py-2 rounded-full text-sm font-bold shadow-md shadow-pink-100 transition-colors"
            >
              Começar agora
            </motion.a>
          </div>
        </div>
      </header>

      {/* ── HERO (duas colunas) ── */}
      <section className="relative pt-16 pb-24 px-5 overflow-hidden">
        {/* Blobs */}
        <div className="absolute -top-20 -left-32 w-[500px] h-[500px] bg-pink-100 rounded-full blur-[120px] opacity-50 pointer-events-none" />
        <div className="absolute top-0 -right-32 w-[400px] h-[400px] bg-rose-100 rounded-full blur-[100px] opacity-40 pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-[400px] h-[300px] bg-orange-50 rounded-full blur-[80px] opacity-60 pointer-events-none" />

        <div className="relative max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* ── Coluna esquerda ── */}
            <motion.div
              className="flex-1 text-center lg:text-left"
              initial="hidden"
              animate="visible"
              variants={stagger}
            >
              {/* Badge */}
              <motion.div variants={fadeUp}>
                <span className="inline-flex items-center gap-2 bg-white border border-pink-100 text-pink-500 text-xs font-bold px-4 py-2 rounded-full shadow-sm mb-7">
                  <Sparkles className="w-3.5 h-3.5" />
                  Mais de 5.000 alunos transformados
                </span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                variants={fadeUp}
                className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5"
              >
                Viaje mais,<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400">
                  gaste muito menos
                </span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeUp}
                className="text-lg md:text-xl text-gray-500 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed"
              >
                O método passo a passo para acumular milhas e emitir passagens
                com até <strong className="text-gray-800 font-bold">80% de desconto</strong> — mesmo começando do zero.
              </motion.p>

              {/* Benefícios rápidos */}
              <motion.ul variants={stagger} className="space-y-2.5 mb-8 max-w-sm mx-auto lg:mx-0">
                {quickBenefits.map((b) => (
                  <motion.li
                    key={b}
                    variants={fadeUp}
                    className="flex items-center gap-3 text-gray-700 text-sm"
                  >
                    <span className="w-5 h-5 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-pink-500" />
                    </span>
                    {b}
                  </motion.li>
                ))}
              </motion.ul>

              {/* CTAs */}
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 mb-8">
                <motion.a
                  href="/pricing"
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-pink-200 transition-colors w-full sm:w-auto justify-center"
                >
                  Quero aprender agora <ArrowRight className="w-4 h-4" />
                </motion.a>
                <motion.a
                  href="/login"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 bg-white border border-pink-200 text-pink-600 px-8 py-4 rounded-full text-base font-semibold hover:bg-pink-50 transition-colors w-full sm:w-auto justify-center"
                >
                  Já tenho conta
                </motion.a>
              </motion.div>

              {/* Prova social — estrelas */}
              <motion.div variants={fadeUp} className="flex items-center gap-3 justify-center lg:justify-start">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  <strong className="text-gray-800">4.9/5</strong> · mais de 500 avaliações
                </p>
              </motion.div>
            </motion.div>

            {/* ── Coluna direita — Mockup ── */}
            <motion.div
              className="flex-1 w-full"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <HeroMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── GALERIA DE RESULTADOS ── */}
      <Section className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-amber-50 text-amber-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Resultados reais
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              O que nossos alunos conquistaram
            </h2>
            <p className="text-gray-400 mt-3 text-lg">Resultados reais de quem aplicou o método</p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {results.map((r) => (
              <motion.div
                key={r.title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-default"
              >
                {/* Imagem / placeholder visual */}
                <div className={`h-36 bg-gradient-to-br ${r.gradient} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 30% 30%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                  <div className="relative text-center text-white">
                    <div className="text-4xl mb-1">{r.emoji}</div>
                    <div className="text-xs font-bold opacity-80 uppercase tracking-wide">{r.tag}</div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-extrabold text-gray-900 text-sm mb-1">{r.title}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">{r.desc}</p>
                  {r.saving && (
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-green-50 text-green-600 text-xs font-bold px-3 py-1 rounded-full border border-green-100">
                      <BadgeDollarSign className="w-3 h-3" />
                      {r.saving}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── BENEFÍCIOS ── */}
      <Section className="py-24 px-5 bg-[#fdf8f6]">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-block bg-pink-50 text-pink-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              O que você aprende
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Tudo para dominar o mundo das milhas
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className={`rounded-3xl p-8 border transition-shadow hover:shadow-lg cursor-default ${b.bg} ${b.border}`}
              >
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <b.Icon className={`w-6 h-6 ${b.iconColor}`} />
                </div>
                <h3 className="font-extrabold text-gray-900 mb-3 text-lg">{b.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{b.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── COMO FUNCIONA ── */}
      <Section className="py-24 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-block bg-rose-50 text-rose-400 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Simples assim
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Como funciona</h2>
          </motion.div>

          <motion.div variants={stagger} className="space-y-4">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ x: 4 }}
                className="flex gap-5 items-start bg-[#fdf8f6] rounded-3xl p-7 border border-gray-100 shadow-sm hover:shadow-md hover:border-pink-100 transition-all cursor-default"
              >
                <div className="w-11 h-11 bg-gradient-to-br from-pink-500 to-rose-400 text-white rounded-2xl flex items-center justify-center font-extrabold text-base flex-shrink-0 shadow-md shadow-pink-100">
                  {i + 1}
                </div>
                <div className="pt-1">
                  <h3 className="font-extrabold text-gray-900 mb-1.5 text-base">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── O QUE ESTÁ INCLUSO ── */}
      <Section className="py-24 px-5 bg-[#fdf8f6]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <span className="inline-block bg-green-50 text-green-600 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Tudo incluso
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-3">
              Um pagamento, acesso para sempre
            </h2>
            <p className="text-gray-400 mb-12">Sem mensalidade. Sem surpresa.</p>
          </motion.div>

          <motion.div variants={stagger} className="flex flex-wrap justify-center gap-3 max-w-2xl mx-auto mb-12">
            {includes.map((item) => (
              <motion.div
                key={item.label}
                variants={fadeUp}
                whileHover={{ y: -3, scale: 1.05 }}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full border font-semibold text-sm cursor-default transition-shadow hover:shadow-md ${item.style}`}
              >
                <item.Icon className="w-4 h-4" />
                {item.label}
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full font-bold shadow-lg shadow-pink-100 transition-colors"
            >
              Ver planos e preços <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </div>
      </Section>

      {/* ── DESTINOS DOS ALUNOS ── */}
      <Section className="py-24 px-5 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <span className="inline-block bg-blue-50 text-blue-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Destinos dos alunos
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">
              Para onde nossos alunos foram
            </h2>
            <p className="text-gray-400 mt-3 text-lg">Tudo usando milhas, pagando muito menos</p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {destinations.map((d) => (
              <motion.div
                key={d.name}
                variants={fadeUp}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`relative rounded-3xl overflow-hidden h-44 bg-gradient-to-br ${d.gradient} cursor-default shadow-sm hover:shadow-xl transition-all`}
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 70% 20%, white 1.5px, transparent 1.5px)', backgroundSize: '25px 25px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <div className="absolute top-4 right-4 text-3xl">{d.emoji}</div>
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-extrabold text-lg leading-none">{d.name}</p>
                  <p className="text-white/70 text-xs mt-1">{d.miles}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section className="py-24 px-5 bg-[#fdf8f6]">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-16">
            <span className="inline-block bg-purple-50 text-purple-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Dúvidas
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900">Perguntas frequentes</h2>
          </motion.div>

          <motion.div variants={stagger} className="space-y-3">
            {faqs.map((faq) => (
              <motion.div key={faq.q} variants={fadeUp}>
                <FaqItem q={faq.q} a={faq.a} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── CTA FINAL ── */}
      <Section className="py-24 px-5 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-pink-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="relative max-w-2xl mx-auto">
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-pink-50/60 p-10 md:p-16 text-center"
          >
            <span className="inline-block bg-pink-50 text-pink-500 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
              Comece hoje
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              Pronto para viajar<br />pagando muito menos?
            </h2>
            <p className="text-gray-400 mb-10 max-w-sm mx-auto text-lg">
              Centenas de pessoas já aprenderam a usar milhas para viajar mais gastando menos.
            </p>
            <motion.a
              href="/pricing"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full text-base font-bold shadow-xl shadow-pink-200 transition-colors"
            >
              Garantir meu acesso agora <ArrowRight className="w-4 h-4" />
            </motion.a>
            <p className="text-gray-400 text-sm mt-5 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> 7 dias de garantia · Sem risco
            </p>
          </motion.div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="bg-gray-950 text-gray-500 py-12 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Plane className="text-pink-400 w-4 h-4" />
            <span className="font-bold text-gray-300">Milhas Club</span>
          </div>
          <p>© {new Date().getFullYear()} Milhas Club. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="/login" className="hover:text-gray-300 transition-colors">Entrar</a>
            <a href="/pricing" className="hover:text-gray-300 transition-colors">Preços</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

/* ─── FAQ Accordion ───────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-white hover:bg-pink-50 border border-gray-100 hover:border-pink-200 rounded-2xl transition-colors overflow-hidden"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <span className="font-bold text-gray-900 text-sm">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-7 h-7 bg-[#fdf8f6] border border-gray-200 rounded-full flex items-center justify-center shadow-sm"
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-colors ${open ? 'text-pink-500' : 'text-gray-400'}`} />
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

/* ─── Data ───────────────────────────────────────────── */
const quickBenefits = [
  'Acumule milhas nos cartões certos desde o primeiro dia',
  'Emita passagens nacionais e internacionais com desconto',
  'Estratégias avançadas de transferência e promoções',
]

const metrics = [
  { Icon: Users, value: '5.000+', label: 'alunos', iconBg: 'bg-pink-50', iconColor: 'text-pink-500' },
  { Icon: TrendingUp, value: '100M+', label: 'milhas emitidas', iconBg: 'bg-rose-50', iconColor: 'text-rose-400' },
  { Icon: BadgeDollarSign, value: 'R$ 2M+', label: 'economizados', iconBg: 'bg-orange-50', iconColor: 'text-orange-400' },
]

const results = [
  {
    emoji: '✈️',
    tag: 'Voo nacional',
    gradient: 'from-pink-400 to-rose-500',
    title: 'Passagem para Orlando',
    desc: 'Voo de ida e volta emitido por apenas 22.000 milhas.',
    saving: 'Economia de R$ 3.200',
  },
  {
    emoji: '🛫',
    tag: 'Business class',
    gradient: 'from-purple-400 to-pink-500',
    title: 'Business Class Europa',
    desc: 'Lisboa em primeira classe com 65.000 pontos acumulados.',
    saving: 'Economia de R$ 8.500',
  },
  {
    emoji: '🏨',
    tag: 'Hotel upgrade',
    gradient: 'from-blue-400 to-cyan-500',
    title: 'Suite em Miami',
    desc: 'Upgrade de quarto para suite com pontos do cartão.',
    saving: 'Economia de R$ 2.100',
  },
  {
    emoji: '💳',
    tag: 'Bônus cartão',
    gradient: 'from-amber-400 to-orange-500',
    title: '80k Pontos de bônus',
    desc: 'Bônus de boas-vindas num cartão premium em 3 meses.',
    saving: 'Equivalente a R$ 1.600',
  },
]

const benefits = [
  {
    Icon: Target,
    iconColor: 'text-pink-500',
    title: 'Acumule milhas do jeito certo',
    description: 'Aprenda quais cartões usar, como maximizar pontos no dia a dia e evitar os erros que fazem a maioria das pessoas perder milhas.',
    bg: 'bg-pink-50',
    border: 'border-pink-100',
  },
  {
    Icon: Map,
    iconColor: 'text-rose-400',
    title: 'Emita passagens com desconto',
    description: 'Descubra o passo a passo para encontrar disponibilidade, escolher o programa certo e emitir passagens nacionais e internacionais.',
    bg: 'bg-rose-50',
    border: 'border-rose-100',
  },
  {
    Icon: Lightbulb,
    iconColor: 'text-orange-400',
    title: 'Estratégias avançadas',
    description: 'Transfira pontos entre programas, aproveite promoções e multiplique suas milhas com técnicas que poucos conhecem.',
    bg: 'bg-orange-50',
    border: 'border-orange-100',
  },
]

const steps = [
  {
    title: 'Acesse o conteúdo completo',
    description: 'Após o pagamento, você tem acesso imediato a todos os módulos e aulas, no seu ritmo e de qualquer dispositivo.',
  },
  {
    title: 'Siga o método passo a passo',
    description: 'As aulas seguem uma sequência lógica: do básico de milhas até a emissão da sua primeira passagem.',
  },
  {
    title: 'Aplique e viaje',
    description: 'Com o conhecimento em mãos, comece a acumular milhas imediatamente e planeje sua próxima viagem com desconto.',
  },
]

const includes = [
  { Icon: Check, label: '6 módulos completos', style: 'bg-pink-50 border-pink-200 text-pink-700' },
  { Icon: Check, label: '35+ aulas em vídeo', style: 'bg-rose-50 border-rose-200 text-rose-700' },
  { Icon: Check, label: 'Acesso vitalício', style: 'bg-orange-50 border-orange-200 text-orange-700' },
  { Icon: Check, label: 'Atualizações gratuitas', style: 'bg-amber-50 border-amber-200 text-amber-700' },
  { Icon: Check, label: 'Qualquer dispositivo', style: 'bg-green-50 border-green-200 text-green-700' },
  { Icon: Check, label: 'Suporte por e-mail', style: 'bg-purple-50 border-purple-200 text-purple-700' },
]

const destinations = [
  { name: 'Orlando', emoji: '🏰', gradient: 'from-sky-400 to-blue-500', miles: 'A partir de 22.000 milhas' },
  { name: 'Dubai', emoji: '🌆', gradient: 'from-amber-400 to-orange-500', miles: 'A partir de 70.000 milhas' },
  { name: 'Paris', emoji: '🗼', gradient: 'from-rose-400 to-pink-500', miles: 'A partir de 55.000 milhas' },
  { name: 'Maldivas', emoji: '🏖️', gradient: 'from-teal-400 to-cyan-500', miles: 'A partir de 80.000 milhas' },
  { name: 'Bariloche', emoji: '🏔️', gradient: 'from-blue-500 to-indigo-600', miles: 'A partir de 18.000 milhas' },
  { name: 'Santiago', emoji: '🌃', gradient: 'from-purple-400 to-violet-500', miles: 'A partir de 15.000 milhas' },
]

const faqs = [
  {
    q: 'Preciso ter cartão de crédito para começar?',
    a: 'Cartão de crédito ajuda a acumular milhas mais rápido, mas não é obrigatório. No curso ensinamos formas de acumular milhas mesmo sem cartão.',
  },
  {
    q: 'O acesso realmente é vitalício?',
    a: 'Sim. Você paga uma única vez e tem acesso para sempre, incluindo todas as atualizações futuras do conteúdo.',
  },
  {
    q: 'Funciona para voos internacionais?',
    a: 'Sim! O curso cobre tanto passagens nacionais quanto internacionais, e você aprenderá a emitir nos principais programas do mercado.',
  },
  {
    q: 'E se eu não gostar do curso?',
    a: 'Você tem 7 dias de garantia. Se não ficar satisfeito por qualquer motivo, basta entrar em contato para reembolso total.',
  },
]
