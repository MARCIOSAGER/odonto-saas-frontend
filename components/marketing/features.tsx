import {
  CalendarDays,
  Users,
  MessageSquare,
  Brain,
  FileText,
  BarChart3,
  Shield,
  Smartphone,
  Bell,
  Search,
  ClipboardList,
  Star,
} from "lucide-react"

const features = [
  {
    icon: CalendarDays,
    title: "Agenda inteligente",
    description:
      "Gerencie agendamentos com visualização por dia, semana ou mês. Confirmação automática via WhatsApp.",
  },
  {
    icon: Users,
    title: "Gestão de pacientes",
    description:
      "Prontuário digital completo com histórico, anamnese, fotos e documentos organizados.",
  },
  {
    icon: ClipboardList,
    title: "Odontograma digital",
    description:
      "Odontograma interativo com marcação por face dental, histórico de procedimentos e legenda visual.",
  },
  {
    icon: MessageSquare,
    title: "WhatsApp integrado",
    description:
      "Envie lembretes, confirmações e mensagens automáticas. Chatbot para agendamento 24h.",
  },
  {
    icon: Brain,
    title: "IA clínica",
    description:
      "Gere prontuários, planos de tratamento e resumos de pacientes com inteligência artificial.",
  },
  {
    icon: FileText,
    title: "Receituário digital",
    description:
      "Crie receitas e atestados com a identidade da sua clínica. Envie por WhatsApp ou e-mail.",
  },
  {
    icon: BarChart3,
    title: "Relatórios financeiros",
    description:
      "Receita por dentista, fluxo de caixa, comissões e exportação para CSV/Excel.",
  },
  {
    icon: Bell,
    title: "Notificações em tempo real",
    description:
      "Receba alertas de agendamentos, pagamentos e ações importantes na hora.",
  },
  {
    icon: Star,
    title: "NPS e avaliações",
    description:
      "Pesquisa de satisfação automática pós-consulta. Direcione promotores para o Google Reviews.",
  },
  {
    icon: Smartphone,
    title: "PWA — instale no celular",
    description:
      "Acesse de qualquer dispositivo. Instale como app no celular sem precisar de loja.",
  },
  {
    icon: Search,
    title: "Busca rápida (Cmd+K)",
    description:
      "Encontre pacientes, navegue e execute ações em segundos com o command palette.",
  },
  {
    icon: Shield,
    title: "Segurança e LGPD",
    description:
      "Autenticação 2FA, dados criptografados, controle de acesso por perfil e conformidade LGPD.",
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-muted/30">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Tudo que sua clínica precisa
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            De agenda a inteligência artificial — funcionalidades pensadas para o dia a dia da odontologia.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-xl border bg-card p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 animate-fade-in-up opacity-0"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
