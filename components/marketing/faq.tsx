"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "Preciso instalar algum software?",
    answer:
      "Não. O nossa plataforma é 100% online e funciona em qualquer navegador. Você também pode instalar como app no celular (PWA) diretamente pelo navegador, sem precisar de loja de aplicativos.",
  },
  {
    question: "O plano grátis tem limitação de tempo?",
    answer:
      "O plano Básico é gratuito para sempre com até 50 pacientes e 2 dentistas. Para funcionalidades avançadas como WhatsApp, IA e relatórios completos, você pode fazer upgrade a qualquer momento.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer:
      "Sim. Utilizamos criptografia em trânsito (HTTPS/TLS) e em repouso. Autenticação com 2FA, controle de acesso por perfil e conformidade com a LGPD. Seus dados são seus — você pode exportar ou excluir a qualquer momento.",
  },
  {
    question: "Posso cancelar a qualquer momento?",
    answer:
      "Sim. Não há fidelidade ou multa de cancelamento. Você pode fazer downgrade ou cancelar quando quiser. Seus dados ficam disponíveis por 30 dias após o cancelamento.",
  },
  {
    question: "Como funciona a integração com WhatsApp?",
    answer:
      "Utilizamos a Z-API para integração com WhatsApp. Você conecta seu número na área de configurações e pode enviar lembretes, confirmações e mensagens automáticas para seus pacientes.",
  },
  {
    question: "A inteligência artificial substitui o dentista?",
    answer:
      "De forma alguma. A IA é uma ferramenta de apoio que ajuda a gerar prontuários a partir de anotações, sugerir planos de tratamento e criar resumos de pacientes. Toda decisão clínica é sempre do profissional.",
  },
  {
    question: "Posso migrar dados de outro sistema?",
    answer:
      "Sim. Oferecemos importação via CSV/Excel para pacientes, dentistas e serviços. Para migrações mais complexas, entre em contato com nosso suporte.",
  },
  {
    question: "Quantas pessoas podem usar ao mesmo tempo?",
    answer:
      "Não há limite de usuários simultâneos. Cada membro da equipe tem seu próprio login com permissões configuráveis (admin, dentista, recepcionista).",
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 text-left"
      >
        <span className="font-medium pr-4">{question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 text-muted-foreground shrink-0 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm text-muted-foreground leading-relaxed">
          {answer}
        </p>
      )}
    </div>
  )
}

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28 bg-muted/30">
      <div className="container max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Tudo que você precisa saber antes de começar.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6">
          {faqs.map((faq) => (
            <FaqItem key={faq.question} {...faq} />
          ))}
        </div>
      </div>
    </section>
  )
}
