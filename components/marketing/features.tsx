"use client"
import { CalendarDays, Brain, MessageSquare, BarChart3, Star, ClipboardList, ChevronRight } from "lucide-react"

const features = [
  {
    icon: CalendarDays,
    title: "Agenda Inteligente",
    description: "Gerencie todos os agendamentos em uma unica visao. Arraste e solte para remarcar, confirmacao automatica via WhatsApp e alertas de conflitos.",
    gradient: "from-violet-500 to-violet-600",
    bgGradient: "from-violet-50 to-violet-100/50",
    mockup: (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-violet-100 h-full">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-900">Fevereiro 2025</p>
          <div className="flex gap-1">
            <div className="w-6 h-6 rounded bg-violet-50 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-violet-600 rotate-180" />
            </div>
            <div className="w-6 h-6 rounded bg-violet-50 flex items-center justify-center">
              <ChevronRight className="w-4 h-4 text-violet-600" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div key={i} className="text-gray-400 font-medium py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-sm">
          {Array.from({ length: 28 }, (_, i) => (
            <div
              key={i}
              className={`py-2 rounded-lg text-sm ${
                i === 14 ? "bg-gradient-to-br from-violet-500 to-indigo-500 text-white font-bold" :
                [5, 12, 19, 24].includes(i) ? "bg-violet-100 text-violet-700" :
                "hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 p-2 bg-violet-50 rounded-lg text-sm border border-violet-100">
            <div className="w-2 h-2 bg-violet-500 rounded-full" />
            <span className="font-medium text-violet-700">09:00</span>
            <span className="text-gray-600">Maria - Limpeza</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-emerald-50 rounded-lg text-sm border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full" />
            <span className="font-medium text-emerald-700">10:30</span>
            <span className="text-gray-600">Joao - Consulta</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Brain,
    title: "Prontuario com IA",
    description: "A inteligencia artificial escuta a consulta e gera o prontuario automaticamente. Economize ate 2 horas por dia em documentacao.",
    gradient: "from-indigo-500 to-indigo-600",
    bgGradient: "from-indigo-50 to-indigo-100/50",
    mockup: (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100 h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">IA Gerando...</p>
            <p className="text-xs text-gray-500">Prontuario automatico</p>
          </div>
        </div>
        <div className="space-y-3">
          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-xs text-indigo-600 font-semibold mb-1">ANAMNESE</p>
            <p className="text-sm text-gray-700">Paciente relata dor no dente 36 ha 3 dias, intensificando com alimentos frios...</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold mb-1">EXAME CLINICO</p>
            <p className="text-sm text-gray-700">Carie extensa na face oclusal do dente 36. Teste de vitalidade positivo...</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-emerald-600 font-semibold mb-1">PLANO DE TRATAMENTO</p>
            <p className="text-sm text-gray-700">Restauracao em resina composta do dente 36...</p>
          </div>
        </div>
        <div className="mt-4 flex gap-2 items-center">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[85%] bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
          </div>
          <div className="w-8 text-xs text-indigo-600 font-semibold">85%</div>
        </div>
      </div>
    ),
  },
  {
    icon: MessageSquare,
    title: "WhatsApp Integrado",
    description: "Envie lembretes automaticos, confirme consultas e se comunique com pacientes direto pelo WhatsApp. Reduza faltas em ate 70%.",
    gradient: "from-emerald-500 to-emerald-600",
    bgGradient: "from-emerald-50 to-emerald-100/50",
    mockup: (
      <div className="bg-[#ECE5DD] rounded-xl p-4 h-full">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-4 py-2 rounded-t-lg -mx-4 -mt-4 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full" />
          <div>
            <p className="font-semibold text-sm">Clinica INTER-IA</p>
            <p className="text-xs text-white/70">Online</p>
          </div>
        </div>
        <div className="space-y-2">
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-sm">Ola Maria! Lembrete: sua consulta esta marcada para amanha as 09:00.</p>
            <p className="text-xs text-gray-400 text-right mt-1">14:30</p>
          </div>
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-sm">Responda:</p>
            <p className="text-sm text-emerald-600">1 - Confirmar</p>
            <p className="text-sm text-emerald-600">2 - Reagendar</p>
            <p className="text-xs text-gray-400 text-right mt-1">14:30</p>
          </div>
          <div className="bg-[#DCF8C6] rounded-lg p-3 max-w-[60%] ml-auto shadow-sm">
            <p className="text-sm">1</p>
            <p className="text-xs text-gray-400 text-right mt-1">14:32</p>
          </div>
          <div className="bg-white rounded-lg p-3 max-w-[80%] shadow-sm">
            <p className="text-sm">Perfeito! Consulta confirmada. Ate amanha!</p>
            <p className="text-xs text-gray-400 text-right mt-1">14:32</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: BarChart3,
    title: "Financeiro Completo",
    description: "Controle receitas, despesas, comissoes e fluxo de caixa. Relatorios automaticos para tomar decisoes baseadas em dados.",
    gradient: "from-purple-500 to-purple-600",
    bgGradient: "from-purple-50 to-purple-100/50",
    mockup: (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100 h-full">
        <div className="flex items-center justify-between mb-4">
          <p className="font-semibold text-gray-900">Receita Mensal</p>
          <span className="text-emerald-600 text-sm font-semibold bg-emerald-50 px-2 py-1 rounded-full">+12.5%</span>
        </div>
        <div className="flex items-end gap-1 h-32 mb-4">
          {[45, 62, 48, 75, 58, 82, 68, 90, 72, 95, 80, 88].map((h, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end">
              <div
                className={`rounded-t-sm ${i === 11 ? "bg-gradient-to-t from-purple-600 to-violet-500" : "bg-purple-200"}`}
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100">
            <p className="text-xs text-gray-500">Receita</p>
            <p className="text-lg font-bold text-emerald-600">R$ 45.280</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <p className="text-xs text-gray-500">Despesas</p>
            <p className="text-lg font-bold text-red-600">R$ 12.150</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: Star,
    title: "NPS e Avaliacoes",
    description: "Coleta automatica de feedback apos cada consulta. Acompanhe a satisfacao dos pacientes e identifique pontos de melhoria.",
    gradient: "from-amber-500 to-amber-600",
    bgGradient: "from-amber-50 to-amber-100/50",
    mockup: (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-100 h-full">
        <div className="text-center mb-4">
          <p className="text-5xl font-bold bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">9.2</p>
          <p className="text-sm text-gray-500">NPS Score</p>
          <div className="flex justify-center gap-1 mt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs text-gray-500">Promotores</div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
            </div>
            <div className="w-8 text-xs text-gray-600">78%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs text-gray-500">Neutros</div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-400 rounded-full" style={{ width: "15%" }} />
            </div>
            <div className="w-8 text-xs text-gray-600">15%</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 text-xs text-gray-500">Detratores</div>
            <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: "7%" }} />
            </div>
            <div className="w-8 text-xs text-gray-600">7%</div>
          </div>
        </div>
        <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
          <p className="text-xs text-emerald-700">&quot;Excelente atendimento! Recomendo a todos.&quot; - Ana S.</p>
        </div>
      </div>
    ),
  },
  {
    icon: ClipboardList,
    title: "Odontograma Digital",
    description: "Mapeie todos os dentes do paciente com facilidade. Registre tratamentos, condicoes e planeje procedimentos visualmente.",
    gradient: "from-cyan-500 to-cyan-600",
    bgGradient: "from-cyan-50 to-cyan-100/50",
    mockup: (
      <div className="bg-white rounded-xl p-4 shadow-sm border border-cyan-100 h-full">
        <p className="font-semibold text-gray-900 mb-4">Odontograma - Maria Silva</p>
        <div className="flex justify-center gap-1 mb-4">
          {[18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28].map((tooth) => (
            <div
              key={tooth}
              className={`w-5 h-7 rounded text-xs flex items-center justify-center font-medium ${
                [16, 26].includes(tooth) ? "bg-red-100 text-red-700 border-red-200" :
                [14, 24].includes(tooth) ? "bg-violet-100 text-violet-700 border-violet-200" :
                [11, 21].includes(tooth) ? "bg-emerald-100 text-emerald-700 border-emerald-200" :
                "bg-gray-100 text-gray-500 border-gray-200"
              } border`}
            >
              {tooth}
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-1 mb-4">
          {[48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38].map((tooth) => (
            <div
              key={tooth}
              className={`w-5 h-7 rounded text-xs flex items-center justify-center font-medium ${
                tooth === 36 ? "bg-amber-100 text-amber-700 border-amber-200" :
                "bg-gray-100 text-gray-500 border-gray-200"
              } border`}
            >
              {tooth}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full border border-red-200">Carie</span>
          <span className="text-xs px-2 py-1 bg-violet-100 text-violet-700 rounded-full border border-violet-200">Restauracao</span>
          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full border border-emerald-200">Saudavel</span>
          <span className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded-full border border-amber-200">Tratamento</span>
        </div>
      </div>
    ),
  },
]

export function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-gradient-to-b from-white to-slate-50">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 rounded-full bg-gradient-to-r from-violet-100 to-indigo-100 border border-violet-200/50">
            <span className="text-sm font-semibold text-violet-700">
              Funcionalidades completas
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
            Tudo que sua clinica precisa
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Funcionalidades pensadas para otimizar cada aspecto da sua rotina clinica
          </p>
        </div>

        {/* Features Grid */}
        <div className="space-y-24">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text */}
              <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-6 shadow-lg`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>

              {/* Mockup */}
              <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <div className={`bg-gradient-to-br ${feature.bgGradient} rounded-2xl p-6 shadow-inner border border-gray-100`}>
                  {feature.mockup}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
