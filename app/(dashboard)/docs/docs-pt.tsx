"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen, Home, Users, Calendar, MessageSquare, Stethoscope,
  Briefcase, Settings, Smartphone, Bot, Bell, MousePointer,
  ChevronRight, Search, Shield, MapPin, BarChart3, Star,
  CreditCard, Mail, Lock, FileText, ClipboardList, UserCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function DocsPagePt() {
  const [activeSection, setActiveSection] = useState("inicio")

  const sections: Section[] = [
    {
      id: "inicio",
      title: "Inicio Rapido",
      icon: <Home size={18} />,
      content: <InicioRapido />,
    },
    {
      id: "dashboard",
      title: "Dashboard",
      icon: <BarChart3 size={18} />,
      content: <DashboardSection />,
    },
    {
      id: "pacientes",
      title: "Pacientes",
      icon: <Users size={18} />,
      content: <PacientesSection />,
    },
    {
      id: "agendamentos",
      title: "Agendamentos",
      icon: <Calendar size={18} />,
      content: <AgendamentosSection />,
    },
    {
      id: "conversas",
      title: "Conversas WhatsApp",
      icon: <MessageSquare size={18} />,
      content: <ConversasSection />,
    },
    {
      id: "dentistas",
      title: "Dentistas",
      icon: <Stethoscope size={18} />,
      content: <DentistasSection />,
    },
    {
      id: "servicos",
      title: "Servicos",
      icon: <Briefcase size={18} />,
      content: <ServicosSection />,
    },
    {
      id: "odontograma",
      title: "Odontograma",
      icon: <ClipboardList size={18} />,
      content: <OdontogramaSection />,
    },
    {
      id: "receituario",
      title: "Receituario Digital",
      icon: <FileText size={18} />,
      content: <ReceituarioSection />,
    },
    {
      id: "relatorios",
      title: "Relatorios",
      icon: <BarChart3 size={18} />,
      content: <RelatoriosSection />,
    },
    {
      id: "nps",
      title: "NPS e Satisfacao",
      icon: <Star size={18} />,
      content: <NpsSection />,
    },
    {
      id: "config-clinica",
      title: "Config. da Clinica",
      icon: <Settings size={18} />,
      content: <ConfigClinicaSection />,
    },
    {
      id: "whatsapp",
      title: "WhatsApp (Z-API)",
      icon: <Smartphone size={18} />,
      content: <WhatsAppSection />,
    },
    {
      id: "automacoes",
      title: "Automacoes WhatsApp",
      icon: <Bell size={18} />,
      content: <AutomacoesSection />,
    },
    {
      id: "email",
      title: "Configuracao de E-mail",
      icon: <Mail size={18} />,
      content: <EmailSection />,
    },
    {
      id: "ia",
      title: "Assistente de IA",
      icon: <Bot size={18} />,
      content: <IASection />,
    },
    {
      id: "interativas",
      title: "Mensagens Interativas",
      icon: <MousePointer size={18} />,
      content: <InterativasSection />,
    },
    {
      id: "lembretes",
      title: "Lembretes Automaticos",
      icon: <Bell size={18} />,
      content: <LembretesSection />,
    },
    {
      id: "dentista-whatsapp",
      title: "Dentista via WhatsApp",
      icon: <Stethoscope size={18} />,
      content: <DentistaWhatsAppSection />,
    },
    {
      id: "faturamento",
      title: "Faturamento e Planos",
      icon: <CreditCard size={18} />,
      content: <FaturamentoSection />,
    },
    {
      id: "seguranca",
      title: "Seguranca e 2FA",
      icon: <Lock size={18} />,
      content: <SegurancaSection />,
    },
    {
      id: "portal-paciente",
      title: "Portal do Paciente",
      icon: <UserCircle size={18} />,
      content: <PortalPacienteSection />,
    },
    {
      id: "command-palette",
      title: "Busca Rapida (Cmd+K)",
      icon: <Search size={18} />,
      content: <CommandPaletteSection />,
    },
  ]

  return (
    <div className="max-w-6xl pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          Guia do Usuario
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Aprenda a usar todas as funcionalidades da plataforma INTER-IA.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar de navegacao */}
        <nav className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-1 max-h-[calc(100vh-120px)] overflow-y-auto pr-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all text-left",
                  activeSection === section.id
                    ? "bg-primary/10 text-primary font-semibold"
                    : "text-gray-600 dark:text-gray-400 hover:bg-muted/50 hover:text-gray-900 dark:hover:text-gray-200"
                )}
              >
                {section.icon}
                {section.title}
                {activeSection === section.id && (
                  <ChevronRight size={14} className="ml-auto" />
                )}
              </button>
            ))}
          </div>
        </nav>

        {/* Seletor mobile */}
        <div className="lg:hidden w-full mb-4">
          <select
            value={activeSection}
            onChange={(e) => setActiveSection(e.target.value)}
            className="w-full p-2 rounded-lg border border-border bg-background text-sm"
          >
            {sections.map((s) => (
              <option key={s.id} value={s.id}>{s.title}</option>
            ))}
          </select>
        </div>

        {/* Conteudo */}
        <div className="flex-1 min-w-0">
          {sections.find((s) => s.id === activeSection)?.content}
        </div>
      </div>
    </div>
  )
}

// ==========================================
// COMPONENTES AUXILIARES
// ==========================================

function DocCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Card className="border-border bg-card shadow-sm mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-gray-900 dark:text-gray-100">{title}</CardTitle>
      </CardHeader>
      <CardContent className="prose prose-sm dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
        {children}
      </CardContent>
    </Card>
  )
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-lg border border-blue-200 dark:border-blue-800 my-3">
      <Shield size={14} className="shrink-0 mt-0.5 text-blue-500" />
      <div>{children}</div>
    </div>
  )
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 mb-4">
      <div className="shrink-0 h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
        {number}
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">{title}</p>
        <div className="text-sm text-gray-600 dark:text-gray-400">{children}</div>
      </div>
    </div>
  )
}

// ==========================================
// SECOES
// ==========================================

function InicioRapido() {
  return (
    <>
      <DocCard title="Bem-vindo ao INTER-IA">
        <p className="text-sm mb-4">
          O INTER-IA e uma plataforma completa para gestao de clinicas odontologicas, com atendimento inteligente via WhatsApp, agendamento online, odontograma digital, receituario, NPS, relatorios financeiros e muito mais.
        </p>
        <p className="text-sm font-semibold mb-3">Para comecar a usar, siga estes passos:</p>
        <Step number={1} title="Configure sua clinica">
          <p>Va em <strong>Configuracoes &gt; Minha Clinica</strong> e preencha os dados: nome, telefone, endereco, CNPJ, horario de funcionamento, logo, cores e redes sociais.</p>
        </Step>
        <Step number={2} title="Cadastre seus dentistas">
          <p>No menu <strong>Dentistas</strong>, adicione os profissionais da clinica com nome, especialidade, CRO, telefone e taxa de comissao.</p>
        </Step>
        <Step number={3} title="Cadastre seus servicos">
          <p>Em <strong>Servicos</strong>, cadastre os procedimentos oferecidos com nome, preco, duracao e categoria.</p>
        </Step>
        <Step number={4} title="Configure o WhatsApp">
          <p>Va em <strong>Configuracoes &gt; WhatsApp</strong>, adicione suas credenciais Z-API (Instance ID, Token, Client-Token) e conecte escaneando o QR Code.</p>
        </Step>
        <Step number={5} title="Configure a IA">
          <p>Em <strong>Configuracoes &gt; Assistente de IA</strong>, escolha o provedor (Claude, GPT ou Gemini), insira a API Key e personalize a assistente.</p>
        </Step>
        <Step number={6} title="Configure o E-mail (opcional)">
          <p>Em <strong>Configuracoes &gt; E-mail</strong>, adicione suas credenciais SMTP para envio de receitas, atestados e notificacoes por email.</p>
        </Step>
        <Step number={7} title="Pronto!">
          <p>Sua clinica esta configurada. Os pacientes podem enviar mensagens pelo WhatsApp e a IA vai atender automaticamente, agendar consultas, informar precos e muito mais.</p>
        </Step>
        <Tip>
          <p>Use o atalho <strong>Cmd+K</strong> (ou Ctrl+K) a qualquer momento para navegar rapidamente entre paginas e buscar pacientes.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function DashboardSection() {
  return (
    <>
      <DocCard title="Dashboard">
        <p className="text-sm mb-3">
          O Dashboard e a tela inicial do sistema. Aqui voce tem uma visao geral da sua clinica com metricas em tempo real:
        </p>
        <ul className="text-sm space-y-2 list-disc list-inside">
          <li><strong>Total de Pacientes</strong> — Quantidade de pacientes cadastrados na clinica.</li>
          <li><strong>Confirmados Hoje</strong> — Agendamentos confirmados para o dia atual.</li>
          <li><strong>Agendamentos Pendentes</strong> — Consultas com status &quot;agendado&quot; que ainda nao foram confirmadas.</li>
          <li><strong>Faturamento Mensal</strong> — Soma dos valores dos servicos das consultas concluidas no mes.</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Grafico de Fluxo Semanal</h4>
        <p className="text-sm mb-2">
          O grafico mostra a quantidade de agendamentos por dia da semana atual, permitindo visualizar o fluxo de pacientes.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Proximos Agendamentos</h4>
        <p className="text-sm mb-2">
          Lista os proximos 5 agendamentos do dia com nome do paciente, servico, horario e status.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Alertas de Assinatura</h4>
        <p className="text-sm">
          Se o periodo de teste estiver perto de expirar (7 dias ou menos) ou ja tiver expirado, um banner de alerta sera exibido com link para assinar um plano.
        </p>
        <Tip>
          <p>Os dados do dashboard sao atualizados automaticamente. Clique em <strong>Ver agenda completa</strong> para ir direto para a pagina de agendamentos.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function PacientesSection() {
  return (
    <>
      <DocCard title="Gestao de Pacientes">
        <p className="text-sm mb-3">
          O modulo de Pacientes permite cadastrar, editar e visualizar todos os pacientes da clinica.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Cadastrar Paciente</h4>
        <p className="text-sm mb-2">
          Clique em <strong>&quot;Novo Paciente&quot;</strong> e preencha: nome completo, CPF, telefone (com DDD), email e data de nascimento.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Ficha do Paciente</h4>
        <p className="text-sm mb-2">
          Clicando no nome de um paciente, voce acessa a ficha completa com:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Dados pessoais e de contato</li>
          <li>Historico de consultas (agendadas, concluidas, canceladas)</li>
          <li>Historico de conversas pelo WhatsApp</li>
          <li>Odontograma digital</li>
          <li>Receitas e atestados emitidos</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Busca e Filtros</h4>
        <p className="text-sm mb-2">
          Use a barra de busca para encontrar pacientes por nome, telefone ou CPF. A lista e paginada para melhor desempenho.
        </p>
        <Tip>
          <p><strong>Cadastro automatico:</strong> Quando um paciente novo envia mensagem pelo WhatsApp, a IA cria o cadastro automaticamente usando o nome e telefone. Voce pode completar os dados depois.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function AgendamentosSection() {
  return (
    <>
      <DocCard title="Agendamentos">
        <p className="text-sm mb-3">
          Gerencie todas as consultas da clinica com visualizacao em calendario (dia, semana ou mes). Voce pode criar agendamentos manualmente ou deixar a IA agendar automaticamente pelo WhatsApp.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Criar Agendamento Manual</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Clique em <strong>&quot;Novo Agendamento&quot;</strong></li>
          <li>Selecione o paciente, dentista, servico, data e horario</li>
          <li>Adicione observacoes se necessario</li>
          <li>Clique em <strong>Salvar</strong></li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Status das Consultas</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Agendado</strong> — Consulta criada, aguardando confirmacao</li>
          <li><strong>Confirmado</strong> — Paciente confirmou presenca</li>
          <li><strong>Concluido</strong> — Consulta realizada com sucesso</li>
          <li><strong>Cancelado</strong> — Consulta cancelada pelo paciente ou clinica</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Agendamento pela IA</h4>
        <p className="text-sm">
          Se a permissao <strong>&quot;Agendar Consultas&quot;</strong> estiver ativa nas configuracoes de IA, a assistente virtual consegue criar agendamentos diretamente pelo WhatsApp, verificando horarios disponiveis automaticamente.
        </p>
        <Tip>
          <p>A IA tambem pode <strong>confirmar</strong> e <strong>cancelar</strong> consultas se as permissoes estiverem ativas. O dentista recebe notificacao no WhatsApp quando uma consulta e criada ou confirmada.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ConversasSection() {
  return (
    <>
      <DocCard title="Conversas WhatsApp">
        <p className="text-sm mb-3">
          Visualize todas as conversas entre pacientes e a assistente de IA em tempo real.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como funciona</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Cada conversa e vinculada a um paciente e clinica</li>
          <li>As mensagens do paciente e da IA sao exibidas em formato de chat</li>
          <li>Voce pode ver o historico completo de cada conversa</li>
          <li>Mensagens de tool use (agendamento, confirmacao, etc.) sao registradas</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Fluxo da Conversa</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Paciente envia mensagem pelo WhatsApp</li>
          <li>O webhook Z-API recebe a mensagem</li>
          <li>A IA processa e gera uma resposta com contexto da clinica</li>
          <li>A resposta e enviada de volta pelo WhatsApp</li>
          <li>Toda a conversa fica registrada no sistema</li>
        </ol>
        <Tip>
          <p>Se a IA nao conseguir resolver, o paciente pode usar palavras-chave de transferencia (configuradas em <strong>Configuracoes &gt; IA &gt; Instrucoes Avancadas</strong>) para ser encaminhado a um atendente humano.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function DentistasSection() {
  return (
    <>
      <DocCard title="Gestao de Dentistas">
        <p className="text-sm mb-3">
          Cadastre e gerencie os profissionais da sua clinica.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Campos do Cadastro</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Nome</strong> — Nome completo do profissional</li>
          <li><strong>Especialidade</strong> — Ex: Ortodontia, Endodontia, Clinico Geral</li>
          <li><strong>CRO</strong> — Registro no Conselho Regional de Odontologia</li>
          <li><strong>Telefone</strong> — Numero do WhatsApp (importante para notificacoes)</li>
          <li><strong>Email</strong> — Email profissional</li>
          <li><strong>Comissao (%)</strong> — Percentual de comissao sobre servicos realizados</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Horarios de Atendimento</h4>
        <p className="text-sm mb-2">
          Configure os horarios de atendimento de cada dentista por dia da semana. A IA usa essa informacao para sugerir horarios disponiveis ao paciente.
        </p>
        <Tip>
          <p><strong>Importante:</strong> O numero de telefone do dentista e usado para identifica-lo quando ele envia mensagens pelo WhatsApp (funcionalidade &quot;Dentista via WhatsApp&quot;). Certifique-se de cadastrar o numero correto com DDD.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ServicosSection() {
  return (
    <>
      <DocCard title="Servicos e Procedimentos">
        <p className="text-sm mb-3">
          Cadastre todos os servicos oferecidos pela clinica. A IA usa essas informacoes para informar precos e agendar consultas.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Campos do Servico</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Nome</strong> — Ex: Limpeza, Clareamento, Canal, Implante</li>
          <li><strong>Descricao</strong> — Detalhes do procedimento</li>
          <li><strong>Preco</strong> — Valor em reais (exibido pela IA quando o paciente perguntar)</li>
          <li><strong>Duracao</strong> — Tempo estimado em minutos (usado para calcular disponibilidade)</li>
          <li><strong>Categoria</strong> — Ex: Estetica, Preventivo, Restauracao</li>
        </ul>
        <Tip>
          <p>A IA tem acesso automatico a todos os servicos e precos cadastrados. Quando um paciente perguntar &quot;quanto custa uma limpeza?&quot;, a IA responde com o valor correto.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function OdontogramaSection() {
  return (
    <>
      <DocCard title="Odontograma Digital">
        <p className="text-sm mb-3">
          O odontograma e uma representacao visual da arcada dentaria do paciente. Permite registrar condicoes e procedimentos por dente e por face dental.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como acessar</h4>
        <p className="text-sm mb-2">
          Acesse a ficha de um paciente e clique na aba <strong>Odontograma</strong>. O mapa dental sera exibido com todos os 32 dentes.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Registrar condicoes</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Clique em um dente para seleciona-lo</li>
          <li>Escolha a face dental (vestibular, lingual, mesial, distal, oclusal)</li>
          <li>Selecione a condicao: carie, restauracao, ausente, implante, protese, etc.</li>
          <li>Adicione observacoes se necessario</li>
          <li>Salve para registrar no historico</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Legenda Visual</h4>
        <p className="text-sm">
          Cada condicao e representada por uma cor diferente no mapa dental, facilitando a visualizacao rapida do estado da arcada do paciente.
        </p>
        <Tip>
          <p>O odontograma mantem um historico completo. Voce pode ver a evolucao do tratamento ao longo do tempo.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ReceituarioSection() {
  return (
    <>
      <DocCard title="Receituario Digital">
        <p className="text-sm mb-3">
          Crie receitas, atestados e encaminhamentos digitais com a identidade visual da sua clinica. Envie diretamente para o paciente por WhatsApp ou e-mail.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Tipos de Documento</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Receita</strong> — Prescricao de medicamentos</li>
          <li><strong>Atestado</strong> — Atestado de comparecimento ou afastamento</li>
          <li><strong>Encaminhamento</strong> — Encaminhamento para especialista</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como criar</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Acesse a ficha do paciente</li>
          <li>Clique em <strong>Nova Receita</strong> (ou Atestado/Encaminhamento)</li>
          <li>Preencha o conteudo do documento</li>
          <li>Selecione o dentista responsavel</li>
          <li>Salve e envie por WhatsApp ou e-mail</li>
        </ol>
        <Tip>
          <p>O documento e gerado como PDF com o logo e dados da clinica automaticamente. Configure o branding em <strong>Configuracoes &gt; Minha Clinica</strong>.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function RelatoriosSection() {
  return (
    <>
      <DocCard title="Relatorios">
        <p className="text-sm mb-3">
          O modulo de relatorios oferece visao detalhada do desempenho financeiro e operacional da clinica.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Relatorios Disponiveis</h4>
        <ul className="text-sm space-y-2 list-disc list-inside mb-3">
          <li><strong>Receita por Dentista</strong> — Quanto cada profissional faturou no periodo selecionado.</li>
          <li><strong>Fluxo de Caixa</strong> — Entradas e saidas financeiras com visao por dia/semana/mes.</li>
          <li><strong>Comissoes</strong> — Calculo automatico de comissoes por dentista com base nos servicos realizados.</li>
          <li><strong>Agendamentos</strong> — Quantidade de consultas por status, dentista e periodo.</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Filtros</h4>
        <p className="text-sm mb-2">
          Todos os relatorios permitem filtrar por periodo (data inicial e final) e por dentista.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Exportacao</h4>
        <p className="text-sm">
          Exporte os dados para CSV para analise em planilhas como Excel ou Google Sheets.
        </p>
        <Tip>
          <p>Acesse os relatorios pelo menu lateral em <strong>Relatorios</strong>. Os dados sao calculados em tempo real com base nos agendamentos concluidos.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function NpsSection() {
  return (
    <>
      <DocCard title="NPS e Pesquisa de Satisfacao">
        <p className="text-sm mb-3">
          O modulo NPS (Net Promoter Score) permite enviar pesquisas de satisfacao automaticas apos as consultas.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como funciona</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Apos uma consulta ser marcada como <strong>concluida</strong>, o sistema pode enviar automaticamente uma pesquisa NPS ao paciente</li>
          <li>O paciente recebe um link por WhatsApp para avaliar de 0 a 10</li>
          <li>O paciente pode adicionar um comentario opcional</li>
          <li>A avaliacao e salva e exibida no painel de NPS</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Classificacao NPS</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Promotores (9-10)</strong> — Pacientes satisfeitos, potenciais indicadores</li>
          <li><strong>Neutros (7-8)</strong> — Satisfeitos mas nao entusiasmados</li>
          <li><strong>Detratores (0-6)</strong> — Pacientes insatisfeitos</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Configuracao</h4>
        <p className="text-sm mb-2">
          Va em <strong>Configuracoes &gt; NPS</strong> para ativar/desativar as pesquisas e personalizar a mensagem enviada ao paciente.
        </p>
        <Tip>
          <p><strong>Google Reviews:</strong> Promotores (nota 9-10) podem ser redirecionados automaticamente para deixar uma avaliacao no Google Reviews da clinica. Configure o link nas configuracoes de NPS.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function ConfigClinicaSection() {
  return (
    <>
      <DocCard title="Configuracoes da Clinica">
        <p className="text-sm mb-3">
          Em <strong>Configuracoes &gt; Minha Clinica</strong>, voce configura todos os dados da sua clinica:
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Dados Basicos</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Nome, CNPJ, Telefone, Email</strong> — Informacoes de identificacao</li>
          <li><strong>Endereco completo</strong> — Rua, cidade, estado, CEP</li>
          <li><strong>Latitude/Longitude</strong> — Para enviar localizacao pelo WhatsApp</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Branding</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Logo</strong> — Upload da logo da clinica (exibida na sidebar e documentos)</li>
          <li><strong>Favicon</strong> — Icone da aba do navegador</li>
          <li><strong>Cor Primaria</strong> — Cor principal da interface (formato hex, ex: #0EA5E9)</li>
          <li><strong>Cor Secundaria</strong> — Cor de destaque</li>
          <li><strong>Modo de Exibicao</strong> — Logo + nome, so logo, ou so nome na sidebar</li>
          <li><strong>Slogan e Tagline</strong> — Frases da clinica</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Redes Sociais</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Instagram, Facebook, Website</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Horario de Funcionamento</h4>
        <p className="text-sm">
          Configure o horario de cada dia da semana. A IA usa essa informacao para saber quando a clinica esta aberta e envia mensagem de &quot;fora do horario&quot; quando configurado.
        </p>
        <Tip>
          <p>As cores configuradas aqui sao aplicadas em tempo real em toda a interface. Cada clinica tem seu proprio branding personalizado.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function WhatsAppSection() {
  return (
    <>
      <DocCard title="Configuracao do WhatsApp (Z-API)">
        <p className="text-sm mb-3">
          A integracao com WhatsApp e feita atraves da Z-API. Voce precisa de uma conta na Z-API para conectar.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Passo a Passo</h4>
        <Step number={1} title="Crie uma conta na Z-API">
          <p>Acesse <strong>z-api.io</strong> e crie sua conta. Voce recebera um Instance ID e um Token.</p>
        </Step>
        <Step number={2} title="Obtenha as credenciais">
          <p>No painel da Z-API, copie:</p>
          <ul className="list-disc list-inside ml-2 mt-1">
            <li><strong>Instance ID</strong> — Identificador da instancia</li>
            <li><strong>Token</strong> — Token de autenticacao</li>
            <li><strong>Client-Token</strong> — Token de seguranca (nas configuracoes de seguranca)</li>
          </ul>
        </Step>
        <Step number={3} title="Configure no sistema">
          <p>Va em <strong>Configuracoes &gt; WhatsApp</strong> e cole as tres credenciais nos campos correspondentes. Salve.</p>
        </Step>
        <Step number={4} title="Conecte o WhatsApp">
          <p>Clique em <strong>&quot;Testar Conexao&quot;</strong>. Se aparecer &quot;desconectado&quot;, clique em <strong>&quot;Gerar QR Code&quot;</strong> e escaneie com seu WhatsApp.</p>
        </Step>
        <Step number={5} title="Configure o Webhook">
          <p>Clique em <strong>&quot;Configurar Webhook Automaticamente&quot;</strong>. Isso faz a Z-API enviar as mensagens recebidas para o seu sistema.</p>
        </Step>
        <Tip>
          <p><strong>Dica:</strong> Se a conexao cair, use o botao <strong>&quot;Reiniciar Instancia&quot;</strong> antes de gerar novo QR Code. Normalmente a reconexao e automatica.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function AutomacoesSection() {
  return (
    <>
      <DocCard title="Automacoes WhatsApp">
        <p className="text-sm mb-3">
          Configure automacoes e templates de mensagem para agilizar a comunicacao com pacientes via WhatsApp.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Templates de Mensagem</h4>
        <p className="text-sm mb-2">
          Crie mensagens pre-formatadas para situacoes comuns:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Confirmacao de consulta</strong> — Enviada quando uma consulta e agendada</li>
          <li><strong>Lembrete</strong> — Enviado 24h ou 1h antes da consulta</li>
          <li><strong>Pos-consulta</strong> — Agradecimento e pesquisa de satisfacao</li>
          <li><strong>Aniversario</strong> — Mensagem personalizada no aniversario do paciente</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Variaveis Disponiveis</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><code className="bg-muted px-1 rounded text-xs">{"{patientName}"}</code> — Nome do paciente</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{date}"}</code> — Data da consulta</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{time}"}</code> — Horario da consulta</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{service}"}</code> — Nome do servico</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{dentist}"}</code> — Nome do dentista</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{clinicName}"}</code> — Nome da clinica</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como acessar</h4>
        <p className="text-sm">
          Va em <strong>Configuracoes &gt; Automacoes</strong> para criar e gerenciar os templates de mensagem.
        </p>
        <Tip>
          <p>As automacoes funcionam em conjunto com os lembretes automaticos. Configure ambos para ter um fluxo de comunicacao completo.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function EmailSection() {
  return (
    <>
      <DocCard title="Configuracao de E-mail (SMTP)">
        <p className="text-sm mb-3">
          Configure o envio de e-mails da sua clinica para notificacoes, receitas, atestados e reset de senha.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Campos de Configuracao</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Host SMTP</strong> — Ex: smtp.hostinger.com, smtp.gmail.com</li>
          <li><strong>Porta</strong> — Geralmente 465 (SSL) ou 587 (TLS)</li>
          <li><strong>Seguro (SSL)</strong> — Ative para portas SSL (465)</li>
          <li><strong>Usuario</strong> — Seu email (ex: contato@suaclinica.com)</li>
          <li><strong>Senha</strong> — Senha do email ou senha de aplicativo</li>
          <li><strong>Remetente (From)</strong> — Nome e email que aparece ao paciente</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como configurar</h4>
        <Step number={1} title="Acesse as configuracoes">
          <p>Va em <strong>Configuracoes &gt; E-mail</strong>.</p>
        </Step>
        <Step number={2} title="Preencha os dados SMTP">
          <p>Insira os dados do servidor de e-mail da sua clinica. Se usar Hostinger, Gmail ou outro provedor, consulte a documentacao deles para os dados SMTP.</p>
        </Step>
        <Step number={3} title="Teste o envio">
          <p>Clique em <strong>&quot;Enviar E-mail de Teste&quot;</strong> para verificar se a configuracao esta funcionando.</p>
        </Step>
        <Tip>
          <p>Cada clinica pode ter sua propria configuracao SMTP. Se nao configurar, o sistema usa o servidor de e-mail padrao da plataforma.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function IASection() {
  return (
    <>
      <DocCard title="Assistente de IA">
        <p className="text-sm mb-3">
          A IA e o coracao do atendimento automatizado. Ela atende pacientes pelo WhatsApp 24 horas por dia.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Provedor e Modelo</h4>
        <p className="text-sm mb-2">Escolha entre tres provedores:</p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Claude (Anthropic)</strong> — Excelente compreensao e tom profissional. Recomendado.</li>
          <li><strong>GPT (OpenAI)</strong> — Grande variedade de modelos. GPT-4o Mini e economico.</li>
          <li><strong>Gemini (Google)</strong> — Modelos Flash sao rapidos e economicos.</li>
        </ul>
        <p className="text-sm mb-3">
          Para cada provedor, voce precisa de uma <strong>API Key</strong> (chave de acesso), obtida no site do provedor.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Identidade da Assistente</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Nome</strong> — O nome que a IA usa (ex: &quot;Sofia&quot;)</li>
          <li><strong>Personalidade</strong> — Descricao do comportamento (ex: &quot;Amigavel, profissional e prestativa&quot;)</li>
          <li><strong>Mensagem de Boas-vindas</strong> — Primeira mensagem ao paciente</li>
          <li><strong>Mensagem de Fallback</strong> — Quando a IA nao entende</li>
          <li><strong>Fora do Horario</strong> — Mensagem quando a clinica esta fechada</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Capacidades e Permissoes</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Agendar Consultas</strong> — Permite a IA criar agendamentos automaticamente</li>
          <li><strong>Confirmar Consultas</strong> — Permite confirmar quando o paciente aceita</li>
          <li><strong>Cancelar Consultas</strong> — Permite cancelar a pedido do paciente</li>
          <li><strong>Notificar Transferencia</strong> — Avisa quando encaminha para humano</li>
          <li><strong>So Horario Comercial</strong> — IA so responde durante horario de funcionamento</li>
          <li><strong>Mensagens de Contexto</strong> — Quantas mensagens anteriores a IA recebe para entender o contexto</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Instrucoes Avancadas</h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li><strong>Instrucoes Customizadas</strong> — Regras especificas da clinica (ex: &quot;Temos estacionamento gratuito&quot;, &quot;Aceitamos cartao em 12x&quot;)</li>
          <li><strong>Palavras de Transferencia</strong> — Palavras que fazem a IA transferir para humano (ex: &quot;reclamacao, gerente&quot;)</li>
          <li><strong>Topicos Bloqueados</strong> — Assuntos que a IA nao deve abordar (ex: &quot;politica, religiao&quot;)</li>
        </ul>
        <Tip>
          <p>A IA ja tem acesso automatico aos servicos, precos, dentistas e horarios disponiveis. Voce nao precisa repetir essas informacoes nas instrucoes customizadas.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function InterativasSection() {
  return (
    <>
      <DocCard title="Mensagens Interativas">
        <p className="text-sm mb-3">
          Mensagens interativas sao recursos avancados do WhatsApp que permitem o paciente clicar em opcoes, botoes e listas em vez de digitar.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Tipos Disponiveis</h4>
        <ul className="text-sm space-y-2 list-disc list-inside mb-3">
          <li>
            <strong>Menu de Boas-vindas</strong> — Quando o paciente manda &quot;oi&quot; ou &quot;ola&quot;, a IA envia uma lista clicavel com opcoes: Agendar, Ver precos, Remarcar, Cancelar, Duvidas.
          </li>
          <li>
            <strong>Botoes de Confirmacao</strong> — Para confirmar consultas, envia botoes: Confirmar, Remarcar, Cancelar.
          </li>
          <li>
            <strong>Lista de Horarios</strong> — Ao agendar, mostra horarios disponiveis em lista clicavel em vez de texto.
          </li>
          <li>
            <strong>Pesquisa de Satisfacao</strong> — Apos consulta, envia enquete: Excelente, Bom, Regular, Ruim.
          </li>
          <li>
            <strong>Enviar Localizacao</strong> — Quando perguntam o endereco, envia pin no mapa com a localizacao da clinica.
          </li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como Ativar</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Va em <strong>Configuracoes &gt; IA &gt; Mensagens Interativas</strong></li>
          <li>Ative os tipos desejados</li>
          <li>Salve as configuracoes</li>
          <li>A IA decide automaticamente quando usar cada tipo</li>
        </ol>
        <Tip>
          <p><strong>Para enviar localizacao:</strong> Configure latitude e longitude da clinica em <strong>Configuracoes &gt; Minha Clinica</strong>. Sem esses dados, a localizacao nao sera enviada.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function LembretesSection() {
  return (
    <>
      <DocCard title="Lembretes Automaticos">
        <p className="text-sm mb-3">
          O sistema envia automaticamente lembretes via WhatsApp antes das consultas agendadas.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como Funciona</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>O sistema verifica a cada <strong>5 minutos</strong> se ha consultas proximas</li>
          <li><strong>Lembrete 24h antes</strong> — Envia mensagem pedindo confirmacao (SIM ou NAO)</li>
          <li><strong>Lembrete 1h antes</strong> — Envia lembrete curto de ultima hora</li>
          <li>Cada consulta recebe no maximo <strong>um lembrete de cada tipo</strong> (nao repete)</li>
          <li>Quando o paciente responde, a IA processa normalmente (pode confirmar ou cancelar)</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Configuracao</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Va em <strong>Configuracoes &gt; Automacoes</strong></li>
          <li>Ative/desative lembretes em geral</li>
          <li>Escolha quais lembretes enviar (24h, 1h ou ambos)</li>
          <li>Opcionalmente, personalize as mensagens</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Mensagens Personalizadas</h4>
        <p className="text-sm mb-2">
          Voce pode criar mensagens customizadas usando variaveis:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><code className="bg-muted px-1 rounded text-xs">{"{patientName}"}</code> — Nome do paciente</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{date}"}</code> — Data da consulta (DD/MM/YYYY)</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{time}"}</code> — Horario da consulta</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{service}"}</code> — Nome do servico</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{dentist}"}</code> — Nome do dentista</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{clinicName}"}</code> — Nome da clinica</li>
        </ul>
        <Tip>
          <p><strong>Exemplo:</strong> &quot;Ola {"{patientName}"}! Lembramos da sua consulta de {"{service}"} amanha as {"{time}"} com {"{dentist}"}. Confirme respondendo SIM.&quot;</p>
        </Tip>
      </DocCard>
    </>
  )
}

function DentistaWhatsAppSection() {
  return (
    <>
      <DocCard title="Dentista via WhatsApp">
        <p className="text-sm mb-3">
          Os dentistas podem consultar sua agenda e gerenciar consultas diretamente pelo WhatsApp, sem precisar acessar o sistema.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Pre-requisitos</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>O dentista precisa ter o <strong>telefone cadastrado</strong> no sistema</li>
          <li>A funcionalidade precisa estar <strong>ativa</strong> em Configuracoes &gt; IA &gt; Dentista via WhatsApp</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Comandos Disponiveis</h4>
        <p className="text-sm mb-2">O dentista envia mensagens pelo WhatsApp para o numero da clinica:</p>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">agenda</code>
            <span className="text-sm">Ver todas as consultas de hoje</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">semana</code>
            <span className="text-sm">Ver consultas dos proximos 7 dias</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">proximo</code>
            <span className="text-sm">Ver o proximo paciente agendado</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">cancelar [nome]</code>
            <span className="text-sm">Cancelar consulta de um paciente (ex: &quot;cancelar Maria&quot;)</span>
          </div>
          <div className="flex items-start gap-3 p-2 rounded-lg bg-muted/20 border border-border">
            <code className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded font-mono shrink-0">reagendar</code>
            <span className="text-sm">Instrucoes para reagendar uma consulta</span>
          </div>
        </div>
        <Tip>
          <p><strong>Como funciona:</strong> O sistema identifica automaticamente que a mensagem veio de um dentista (pelo numero de telefone) e exibe o menu de opcoes. O dentista nao precisa se identificar.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function FaturamentoSection() {
  return (
    <>
      <DocCard title="Faturamento e Planos">
        <p className="text-sm mb-3">
          Gerencie a assinatura da sua clinica, visualize faturas e acompanhe o uso da plataforma.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Periodo de Teste</h4>
        <p className="text-sm mb-2">
          Ao criar uma conta, voce recebe um periodo de teste gratuito. Durante esse periodo, todas as funcionalidades estao disponiveis. Quando o teste expirar, o sistema entra em modo somente leitura ate que um plano seja assinado.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Planos Disponiveis</h4>
        <p className="text-sm mb-2">
          Acesse <strong>Configuracoes &gt; Faturamento</strong> para ver os planos disponiveis e seus recursos. Cada plano oferece diferentes limites de pacientes, dentistas e funcionalidades.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Pagamento</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Pagamento processado via <strong>Stripe</strong> (cartao de credito)</li>
          <li>Cobranca mensal ou anual (com desconto)</li>
          <li>Faturas disponiveis para download</li>
          <li>Cancelamento a qualquer momento</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Historico de Faturas</h4>
        <p className="text-sm">
          Todas as faturas sao listadas em <strong>Configuracoes &gt; Faturamento</strong> com status (paga, pendente, vencida) e link para download.
        </p>
        <Tip>
          <p>Se o periodo de teste estiver perto de expirar, um banner de alerta sera exibido no Dashboard. Assine antes para nao perder acesso.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function SegurancaSection() {
  return (
    <>
      <DocCard title="Seguranca e Autenticacao 2FA">
        <p className="text-sm mb-3">
          Proteja sua conta e a clinica com autenticacao de dois fatores (2FA) e outras configuracoes de seguranca.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Autenticacao 2FA</h4>
        <p className="text-sm mb-2">
          A autenticacao de dois fatores adiciona uma camada extra de seguranca ao login. Alem da senha, voce precisa informar um codigo temporario.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Metodos Disponiveis</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>App Autenticador (TOTP)</strong> — Use Google Authenticator, Authy ou similar. Escaneie o QR Code para configurar.</li>
          <li><strong>WhatsApp</strong> — Receba o codigo de verificacao via WhatsApp. Mais pratico, porem depende da disponibilidade do servico.</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como ativar</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Va em <strong>Configuracoes &gt; Seguranca</strong></li>
          <li>Escolha o metodo preferido (TOTP ou WhatsApp)</li>
          <li>Siga as instrucoes de configuracao</li>
          <li>Para TOTP: escaneie o QR Code e insira o codigo de verificacao</li>
          <li>Para WhatsApp: insira o codigo recebido no seu numero</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Politica 2FA da Clinica</h4>
        <p className="text-sm mb-2">
          Administradores podem definir uma politica de 2FA para toda a clinica:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Opcional</strong> — Cada usuario escolhe se quer ativar</li>
          <li><strong>Obrigatorio</strong> — Todos os usuarios da clinica devem ter 2FA ativo</li>
        </ul>
        <Tip>
          <p><strong>Recomendacao:</strong> Ative o 2FA para todos os usuarios com acesso a dados sensiveis de pacientes. Isso ajuda na conformidade com a LGPD.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function PortalPacienteSection() {
  return (
    <>
      <DocCard title="Portal do Paciente">
        <p className="text-sm mb-3">
          O Portal do Paciente permite que pacientes acessem suas informacoes sem precisar criar uma conta ou fazer login.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como funciona</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Cada paciente tem um <strong>token unico</strong> gerado automaticamente</li>
          <li>O link do portal pode ser enviado por WhatsApp ou e-mail</li>
          <li>Ao acessar o link, o paciente ve suas informacoes sem precisar de senha</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">O que o paciente pode ver</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Proximas consultas agendadas</li>
          <li>Historico de consultas anteriores</li>
          <li>Dados pessoais de cadastro</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como enviar o link</h4>
        <p className="text-sm mb-2">
          Na ficha do paciente, clique em <strong>&quot;Enviar Link do Portal&quot;</strong> para enviar o acesso por WhatsApp.
        </p>
        <Tip>
          <p>O link do portal e seguro — cada paciente tem um token unico que so da acesso aos seus proprios dados. O token nao expira, mas pode ser regenerado se necessario.</p>
        </Tip>
      </DocCard>
    </>
  )
}

function CommandPaletteSection() {
  return (
    <>
      <DocCard title="Busca Rapida (Cmd+K)">
        <p className="text-sm mb-3">
          O command palette permite navegar rapidamente entre paginas e buscar pacientes sem usar o mouse.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Como usar</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Pressione <strong>Cmd+K</strong> (Mac) ou <strong>Ctrl+K</strong> (Windows/Linux)</li>
          <li>Digite o que procura: nome de pagina, paciente, etc.</li>
          <li>Use as setas para navegar e <strong>Enter</strong> para selecionar</li>
          <li>Pressione <strong>Esc</strong> para fechar</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">O que voce pode fazer</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Navegar</strong> — Acesse qualquer pagina do sistema (Dashboard, Pacientes, Agendamentos, Configuracoes, etc.)</li>
          <li><strong>Buscar pacientes</strong> — Digite o nome do paciente para ir direto para a ficha dele</li>
          <li><strong>Acoes rapidas</strong> — Novo agendamento, novo paciente, etc.</li>
        </ul>
        <Tip>
          <p>O command palette e a forma mais rapida de navegar pelo sistema. Tente usar <strong>Cmd+K</strong> agora!</p>
        </Tip>
      </DocCard>
    </>
  )
}
