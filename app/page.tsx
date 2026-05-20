'use client'

import { motion, AnimatePresence, type Variants } from 'framer-motion'
import {
  Plane, Target, Map, Lightbulb, Check,
  ArrowRight, ChevronDown,
} from 'lucide-react'
import { useState } from 'react'

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
}

function Section({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={stagger}
    >
      {children}
    </motion.section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <div className="h-px w-10 bg-brand-blue" />
      <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.25em]">{children}</span>
      <div className="h-px w-10 bg-brand-blue" />
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <button
      onClick={() => setOpen(!open)}
      className="w-full text-left bg-white border border-brand-border rounded-2xl overflow-hidden transition-all hover:border-brand-blue hover:shadow-card"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5">
        <span className="font-semibold text-brand-text text-sm">{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown className={`w-4 h-4 transition-colors ${open ? 'text-brand-blue' : 'text-brand-text-muted'}`} />
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="px-6 pb-5 text-brand-text-secondary text-sm leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen bg-white overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className="bg-white/90 backdrop-blur-md border-b border-brand-border sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-5 py-4 flex justify-between items-center">
          <a href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-blue rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <Plane className="w-4 h-4 text-white -rotate-45" />
            </div>
            <span className="text-lg font-extrabold text-brand-blue-dark tracking-tight">
              Milhas<span className="text-brand-blue">Club</span>
            </span>
          </a>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-brand-text-secondary text-sm hover:text-brand-blue transition-colors hidden sm:block font-medium">
              Entrar
            </a>
            <a
              href="/pricing"
              className="bg-brand-blue hover:bg-brand-blue-hover text-white px-5 py-2 rounded-full text-sm font-bold transition-colors shadow-btn"
            >
              Começar agora
            </a>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative pt-24 pb-32 px-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #F5FAFF 50%, #EAF3FF 100%)' }}
      >
        {/* Decoração de rotas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" viewBox="0 0 900 500" fill="none" preserveAspectRatio="xMidYMid slice">
          <path d="M 30 420 Q 450 40 870 360" stroke="#D8E8FF" strokeWidth="2" strokeDasharray="8 7" />
          <path d="M 0 310 Q 350 70 820 270" stroke="#D8E8FF" strokeWidth="1.2" strokeDasharray="5 9" />
          <path d="M 80 490 Q 520 90 880 430" stroke="#D8E8FF" strokeWidth="1" strokeDasharray="4 12" />
          <circle cx="30" cy="420" r="4" fill="#006BFF" opacity="0.4" />
          <circle cx="870" cy="360" r="4" fill="#006BFF" opacity="0.4" />
          <circle cx="820" cy="270" r="3" fill="#006BFF" opacity="0.25" />
        </svg>

        {/* Avião decorativo */}
        <div className="absolute right-[-60px] top-1/2 -translate-y-1/2 opacity-[0.05] pointer-events-none select-none">
          <Plane className="w-[520px] h-[520px] text-brand-blue -rotate-12" />
        </div>

        <div className="relative max-w-3xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={stagger}>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-2 mb-8">
              <Plane className="w-3.5 h-3.5 text-brand-blue -rotate-45" />
              <span className="text-brand-blue text-xs font-bold uppercase tracking-[0.3em]">
                Curso de milhas aéreas
              </span>
              <Plane className="w-3.5 h-3.5 text-brand-blue rotate-45 scale-x-[-1]" />
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-7xl md:text-8xl lg:text-9xl text-brand-blue-dark leading-none mb-6"
            >
              Viaje mais,<br />
              <span className="text-brand-blue">gaste muito menos.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg md:text-xl text-brand-text-secondary mb-10 max-w-xl mx-auto leading-relaxed"
            >
              O método passo a passo para acumular milhas e emitir passagens
              com até <strong className="text-brand-text font-bold">80% de desconto</strong> — mesmo começando do zero.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8"
            >
              <a
                href="/pricing"
                className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-4 rounded-full text-base font-bold shadow-btn hover:shadow-hover transition-all hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                Garantir meu acesso <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="/login"
                className="inline-flex items-center gap-2 border border-brand-border text-brand-text-secondary px-8 py-4 rounded-full text-base font-semibold hover:border-brand-blue hover:text-brand-blue transition-colors w-full sm:w-auto justify-center"
              >
                Já tenho conta
              </a>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-sm text-brand-text-muted flex items-center justify-center gap-3"
            >
              <span>Acesso imediato</span>
              <span className="text-brand-border">·</span>
              <span>Pagamento seguro</span>
            </motion.p>

          </motion.div>
        </div>
      </section>

      {/* ── O QUE VOCÊ APRENDE ── */}
      <Section className="py-24 px-5 bg-brand-off-white">
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <SectionLabel>Conteúdo do curso</SectionLabel>
            <h2 className="text-5xl md:text-6xl text-brand-blue-dark">
              O que você vai aprender
            </h2>
            <p className="text-brand-text-muted mt-3">Do básico ao avançado, em ordem lógica</p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {benefits.map((b) => (
              <motion.div
                key={b.title}
                variants={fadeUp}
                whileHover={{ y: -4, borderColor: '#006BFF', boxShadow: '0 20px 45px rgba(0,107,255,0.15)' }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #D8E8FF',
                  borderRadius: 16,
                  padding: 32,
                  boxShadow: '0 12px 35px rgba(0,107,255,0.08)',
                  transition: 'all 0.25s ease',
                }}
              >
                <div className="w-12 h-12 bg-brand-blue rounded-xl flex items-center justify-center mb-5 shadow-btn">
                  <b.Icon className="w-5 h-5 text-white" />
                </div>
                <h3
                  className="text-brand-blue-dark font-bold uppercase mb-3"
                  style={{ letterSpacing: '0.5px', fontSize: '1rem' }}
                >
                  {b.title}
                </h3>
                <p className="text-brand-text-secondary leading-relaxed" style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                  {b.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── COMO FUNCIONA ── */}
      <Section className="py-24 px-5 bg-white">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <SectionLabel>Simples assim</SectionLabel>
            <h2 className="text-5xl md:text-6xl text-brand-blue-dark">Como funciona</h2>
          </motion.div>

          <motion.div variants={stagger} className="space-y-3">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                className="flex gap-5 items-start bg-brand-sky rounded-2xl p-6 border border-brand-border hover:border-brand-blue transition-all"
              >
                <div className="w-10 h-10 bg-brand-blue text-white rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 shadow-btn">
                  {i + 1}
                </div>
                <div className="pt-0.5">
                  <h3 className="text-brand-blue-dark font-bold uppercase mb-1" style={{ fontSize: '1rem' }}>{step.title}</h3>
                  <p className="text-brand-text-secondary text-sm leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── O QUE ESTÁ INCLUSO ── */}
      <Section className="py-24 px-5 bg-brand-blue-soft">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div variants={fadeUp} className="mb-14">
            <SectionLabel>Tudo incluso</SectionLabel>
            <h2 className="text-5xl md:text-6xl text-brand-blue-dark mb-2">
              Um pagamento, acesso para sempre
            </h2>
            <p className="text-brand-text-muted">Sem mensalidade. Sem surpresa.</p>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12 text-left">
            {includes.map((item) => (
              <motion.div
                key={item}
                variants={fadeUp}
                className="flex items-center gap-3 bg-white rounded-xl px-4 py-3.5 border border-brand-border shadow-sm hover:border-brand-blue transition-colors"
              >
                <span className="w-5 h-5 bg-brand-blue rounded-full flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <span className="text-sm font-medium text-brand-text">{item}</span>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={fadeUp}>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-blue-hover text-white px-8 py-4 rounded-full font-bold shadow-btn hover:shadow-hover transition-all hover:-translate-y-0.5"
            >
              Ver planos e preços <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* ── FAQ ── */}
      <Section className="py-24 px-5 bg-brand-off-white">
        <div className="max-w-2xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <SectionLabel>Dúvidas</SectionLabel>
            <h2 className="text-5xl md:text-6xl text-brand-blue-dark">Perguntas frequentes</h2>
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
      <Section className="py-24 px-5 bg-brand-blue relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg viewBox="0 0 900 300" fill="none" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
            <path d="M 30 250 Q 450 20 870 220" stroke="white" strokeWidth="1.5" strokeDasharray="8 7" />
            <path d="M 0 180 Q 350 40 820 160" stroke="white" strokeWidth="1" strokeDasharray="5 9" />
          </svg>
        </div>
        <div className="relative max-w-2xl mx-auto text-center">
          <motion.div variants={fadeUp}>
            <div className="flex items-center justify-center gap-2 mb-6">
              <Plane className="w-5 h-5 text-white/80 -rotate-45" />
              <span className="text-white/80 text-xs font-bold uppercase tracking-[0.25em]">Embarque agora</span>
            </div>
            <h2 className="text-5xl md:text-7xl text-white mb-4 leading-none">
              Pronto para viajar pagando muito menos?
            </h2>
            <p className="text-white/80 mb-10 text-lg">
              Acesso imediato assim que o pagamento for confirmado.
            </p>
            <a
              href="/pricing"
              className="inline-flex items-center gap-2 bg-white hover:bg-brand-sky text-brand-blue px-8 py-4 rounded-full text-base font-bold shadow-2xl transition-all hover:-translate-y-0.5"
            >
              Garantir meu acesso agora <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </Section>

      {/* ── FOOTER ── */}
      <footer className="bg-brand-blue-dark text-white/60 py-10 px-5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-brand-blue rounded-lg flex items-center justify-center flex-shrink-0">
              <Plane className="w-3.5 h-3.5 text-white -rotate-45" />
            </div>
            <span className="font-extrabold text-white tracking-tight">
              Milhas<span className="text-brand-blue" style={{ filter: 'brightness(1.5)' }}>Club</span>
            </span>
          </div>
          <p>© {new Date().getFullYear()} Milhas Club. Todos os direitos reservados.</p>
          <div className="flex items-center gap-5">
            <a href="/login" className="hover:text-white transition-colors">Entrar</a>
            <a href="/pricing" className="hover:text-white transition-colors">Preços</a>
          </div>
        </div>
      </footer>

    </main>
  )
}

/* ─── Data ─────────────────────────────────────────────── */

const benefits = [
  {
    Icon: Target,
    title: 'Acumule milhas do jeito certo',
    description: 'Aprenda quais cartões usar, como maximizar pontos no dia a dia e evitar os erros que fazem a maioria das pessoas perder milhas.',
  },
  {
    Icon: Map,
    title: 'Emita passagens com desconto',
    description: 'Descubra o passo a passo para encontrar disponibilidade, escolher o programa certo e emitir passagens nacionais e internacionais.',
  },
  {
    Icon: Lightbulb,
    title: 'Estratégias avançadas',
    description: 'Transfira pontos entre programas, aproveite promoções e multiplique suas milhas com técnicas que poucos conhecem.',
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
  '6 módulos completos',
  '35+ aulas em vídeo',
  'Acesso vitalício',
  'Atualizações gratuitas',
  'Qualquer dispositivo',
  'Suporte por e-mail',
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
]
