"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen, Home, Users, Calendar, MessageSquare, Stethoscope,
  Briefcase, Settings, Smartphone, Bot, Bell, MousePointer,
  ChevronRight, Search, Shield, MapPin, BarChart3
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  icon: React.ReactNode
  content: React.ReactNode
}

export default function DocsPage() {
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
  ]

  return (
    <div className="max-w-6xl pb-12">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen size={24} className="text-primary" />
          Guia do Usuario
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Aprenda a usar todas as funcionalidades da plataforma Odonto SaaS.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar de navegacao */}
        <nav className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-20 space-y-1">
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
// SECOES
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

function InicioRapido() {
  return (
    <>
      <DocCard title="Bem-vindo ao Odonto SaaS">
        <p className="text-sm mb-4">
          O Odonto SaaS e uma plataforma completa para gestao de clinicas odontologicas, com atendimento inteligente via WhatsApp, agendamento online e muito mais.
        </p>
        <p className="text-sm font-semibold mb-3">Para comecar a usar, siga estes passos:</p>
        <Step number={1} title="Configure sua clinica">
          <p>Va em <strong>Configuracoes &gt; Minha Clinica</strong> e preencha os dados: nome, telefone, endereco, CNPJ, horario de funcionamento e redes sociais.</p>
        </Step>
        <Step number={2} title="Cadastre seus dentistas">
          <p>No menu <strong>Dentistas</strong>, adicione os profissionais da clinica com nome, especialidade, CRO e telefone.</p>
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
        <Step number={6} title="Pronto!">
          <p>Sua clinica esta configurada. Os pacientes podem enviar mensagens pelo WhatsApp e a IA vai atender automaticamente, agendar consultas, informar precos e muito mais.</p>
        </Step>
      </DocCard>
    </>
  )
}

function DashboardSection() {
  return (
    <>
      <DocCard title="Dashboard">
        <p className="text-sm mb-3">
          O Dashboard e a tela inicial do sistema. Aqui voce tem uma visao geral da sua clinica:
        </p>
        <ul className="text-sm space-y-2 list-disc list-inside">
          <li><strong>Total de Pacientes</strong> - Quantidade de pacientes ativos cadastrados.</li>
          <li><strong>Consultas Hoje</strong> - Numero de agendamentos para o dia atual.</li>
          <li><strong>Consultas Pendentes</strong> - Agendamentos com status "agendado" que ainda nao foram confirmados.</li>
          <li><strong>Receita do Mes</strong> - Soma dos valores dos servicos das consultas concluidas no mes.</li>
        </ul>
        <Tip>
          <p>Os dados do dashboard sao atualizados em tempo real. Acesse pela barra lateral clicando em <strong>Dashboard</strong>.</p>
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
          Clique em <strong>"Novo Paciente"</strong> e preencha: nome completo, telefone (com DDD), email e data de nascimento.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Ficha do Paciente</h4>
        <p className="text-sm mb-2">
          Clicando no nome de um paciente, voce acessa a ficha completa com:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>Dados pessoais e de contato</li>
          <li>Historico de consultas (agendadas, concluidas, canceladas)</li>
          <li>Historico de conversas pelo WhatsApp</li>
        </ul>
        <Tip>
          <p><strong>Cadastro automatico:</strong> Quando um paciente novo envia mensagem pelo WhatsApp, a IA cria o cadastro automaticamente usando o nome e telefone.</p>
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
          Gerencie todas as consultas da clinica. Voce pode criar agendamentos manualmente ou deixar a IA agendar automaticamente pelo WhatsApp.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Criar Agendamento Manual</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Clique em <strong>"Novo Agendamento"</strong> (botao no header ou na pagina)</li>
          <li>Selecione o paciente, dentista, servico, data e horario</li>
          <li>Adicione observacoes se necessario</li>
          <li>Clique em <strong>Salvar</strong></li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Status das Consultas</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Agendado</strong> - Consulta criada, aguardando confirmacao</li>
          <li><strong>Confirmado</strong> - Paciente confirmou presenca</li>
          <li><strong>Concluido</strong> - Consulta realizada</li>
          <li><strong>Cancelado</strong> - Consulta cancelada pelo paciente ou clinica</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Agendamento pela IA</h4>
        <p className="text-sm">
          Se a permissao <strong>"Agendar Consultas"</strong> estiver ativa nas configuracoes de IA, a assistente virtual consegue criar agendamentos diretamente pelo WhatsApp, verificando horarios disponiveis automaticamente.
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
          <li><strong>Nome</strong> - Nome completo do profissional</li>
          <li><strong>Especialidade</strong> - Ex: Ortodontia, Endodontia, Clinico Geral</li>
          <li><strong>CRO</strong> - Registro no Conselho Regional de Odontologia</li>
          <li><strong>Telefone</strong> - Numero do WhatsApp (importante para receber notificacoes)</li>
          <li><strong>Email</strong> - Email profissional</li>
        </ul>
        <Tip>
          <p><strong>Importante:</strong> O numero de telefone do dentista e usado para identifica-lo quando ele envia mensagens pelo WhatsApp (funcionalidade "Dentista via WhatsApp"). Certifique-se de cadastrar o numero correto com DDD.</p>
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
          <li><strong>Nome</strong> - Ex: Limpeza, Clareamento, Canal, Implante</li>
          <li><strong>Descricao</strong> - Detalhes do procedimento</li>
          <li><strong>Preco</strong> - Valor em reais (exibido pela IA quando o paciente perguntar)</li>
          <li><strong>Duracao</strong> - Tempo estimado em minutos (usado para calcular disponibilidade)</li>
          <li><strong>Categoria</strong> - Ex: Estetica, Preventivo, Restauracao</li>
        </ul>
        <Tip>
          <p>A IA tem acesso automatico a todos os servicos e precos cadastrados. Quando um paciente perguntar "quanto custa uma limpeza?", a IA responde com o valor correto.</p>
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
          Em <strong>Configuracoes &gt; Minha Clinica</strong>, voce configura os dados gerais:
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Dados Basicos</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Nome, CNPJ, Telefone, Email</strong> - Informacoes de identificacao</li>
          <li><strong>Endereco completo</strong> - Rua, cidade, estado, CEP</li>
          <li><strong>Latitude/Longitude</strong> - Para enviar localizacao pelo WhatsApp</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Branding</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Logo e Favicon</strong> - URLs das imagens</li>
          <li><strong>Cores primaria e secundaria</strong> - Em formato hex (#0EA5E9)</li>
          <li><strong>Slogan e Tagline</strong> - Frases da clinica</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Redes Sociais</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li>Instagram, Facebook, Website</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Horario de Funcionamento</h4>
        <p className="text-sm">
          Configure o horario de cada dia da semana. A IA usa essa informacao para saber quando a clinica esta aberta e pode enviar mensagens fora do horario quando configurado.
        </p>
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
            <li><strong>Instance ID</strong> - Identificador da instancia</li>
            <li><strong>Token</strong> - Token de autenticacao</li>
            <li><strong>Client-Token</strong> - Token de seguranca (nas configuracoes de seguranca)</li>
          </ul>
        </Step>
        <Step number={3} title="Configure no sistema">
          <p>Va em <strong>Configuracoes &gt; WhatsApp</strong> e cole as tres credenciais nos campos correspondentes. Salve.</p>
        </Step>
        <Step number={4} title="Conecte o WhatsApp">
          <p>Clique em <strong>"Testar Conexao"</strong>. Se aparecer "desconectado", clique em <strong>"Gerar QR Code"</strong> e escaneie com seu WhatsApp.</p>
        </Step>
        <Step number={5} title="Configure o Webhook">
          <p>Clique em <strong>"Configurar Webhook Automaticamente"</strong>. Isso faz a Z-API enviar as mensagens recebidas para o seu sistema.</p>
        </Step>
        <Tip>
          <p><strong>Dica:</strong> Se a conexao cair, use o botao <strong>"Reiniciar Instancia"</strong> antes de gerar novo QR Code. Normalmente a reconexao e automatica.</p>
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
          <li><strong>Claude (Anthropic)</strong> - Excelente compreensao e tom profissional. Recomendado.</li>
          <li><strong>GPT (OpenAI)</strong> - Grande variedade de modelos. GPT-4o Mini e economico.</li>
          <li><strong>Gemini (Google)</strong> - Modelos Flash sao rapidos e economicos.</li>
        </ul>
        <p className="text-sm mb-3">
          Para cada provedor, voce precisa de uma <strong>API Key</strong> (chave de acesso), obtida no site do provedor.
        </p>
        <h4 className="font-semibold text-sm mt-4 mb-2">Identidade da Assistente</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Nome</strong> - O nome que a IA usa (ex: "Sofia")</li>
          <li><strong>Personalidade</strong> - Descricao do comportamento (ex: "Amigavel, profissional e prestativa")</li>
          <li><strong>Mensagem de Boas-vindas</strong> - Primeira mensagem ao paciente</li>
          <li><strong>Mensagem de Fallback</strong> - Quando a IA nao entende</li>
          <li><strong>Fora do Horario</strong> - Mensagem quando a clinica esta fechada</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Capacidades e Permissoes</h4>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><strong>Agendar Consultas</strong> - Permite a IA criar agendamentos automaticamente</li>
          <li><strong>Confirmar Consultas</strong> - Permite confirmar quando o paciente aceita</li>
          <li><strong>Cancelar Consultas</strong> - Permite cancelar a pedido do paciente</li>
          <li><strong>Notificar Transferencia</strong> - Avisa quando encaminha para humano</li>
          <li><strong>So Horario Comercial</strong> - IA so responde durante horario de funcionamento</li>
          <li><strong>Mensagens de Contexto</strong> - Quantas mensagens anteriores a IA recebe para entender o contexto</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Instrucoes Avancadas</h4>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li><strong>Instrucoes Customizadas</strong> - Regras especificas da clinica (ex: "Temos estacionamento gratuito", "Aceitamos cartao em 12x")</li>
          <li><strong>Palavras de Transferencia</strong> - Palavras que fazem a IA transferir para humano (ex: "reclamacao, gerente")</li>
          <li><strong>Topicos Bloqueados</strong> - Assuntos que a IA nao deve abordar (ex: "politica, religiao")</li>
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
            <strong>Menu de Boas-vindas</strong> - Quando o paciente manda "oi" ou "ola", a IA envia uma lista clicavel com opcoes: Agendar, Ver precos, Remarcar, Cancelar, Duvidas.
          </li>
          <li>
            <strong>Botoes de Confirmacao</strong> - Para confirmar consultas, envia botoes: Confirmar, Remarcar, Cancelar.
          </li>
          <li>
            <strong>Lista de Horarios</strong> - Ao agendar, mostra horarios disponiveis em lista clicavel em vez de texto.
          </li>
          <li>
            <strong>Pesquisa de Satisfacao</strong> - Apos consulta, envia enquete: Excelente, Bom, Regular, Ruim.
          </li>
          <li>
            <strong>Enviar Localizacao</strong> - Quando perguntam o endereco, envia pin no mapa com a localizacao da clinica.
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
          <li><strong>Lembrete 24h antes</strong> - Envia mensagem pedindo confirmacao (SIM ou NAO)</li>
          <li><strong>Lembrete 1h antes</strong> - Envia lembrete curto de ultima hora</li>
          <li>Cada consulta recebe no maximo <strong>um lembrete de cada tipo</strong> (nao repete)</li>
          <li>Quando o paciente responde, a IA processa normalmente (pode confirmar ou cancelar)</li>
        </ul>
        <h4 className="font-semibold text-sm mt-4 mb-2">Configuracao</h4>
        <ol className="text-sm space-y-1 list-decimal list-inside mb-3">
          <li>Va em <strong>Configuracoes &gt; IA &gt; Lembretes Automaticos</strong></li>
          <li>Ative/desative lembretes em geral</li>
          <li>Escolha quais lembretes enviar (24h, 1h ou ambos)</li>
          <li>Opcionalmente, personalize as mensagens</li>
        </ol>
        <h4 className="font-semibold text-sm mt-4 mb-2">Mensagens Personalizadas</h4>
        <p className="text-sm mb-2">
          Voce pode criar mensagens customizadas usando variaveis:
        </p>
        <ul className="text-sm space-y-1 list-disc list-inside mb-3">
          <li><code className="bg-muted px-1 rounded text-xs">{"{patientName}"}</code> - Nome do paciente</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{date}"}</code> - Data da consulta (DD/MM/YYYY)</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{time}"}</code> - Horario da consulta</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{service}"}</code> - Nome do servico</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{dentist}"}</code> - Nome do dentista</li>
          <li><code className="bg-muted px-1 rounded text-xs">{"{clinicName}"}</code> - Nome da clinica</li>
        </ul>
        <Tip>
          <p><strong>Exemplo:</strong> "Ola {"{patientName}"}! Lembramos da sua consulta de {"{service}"} amanha as {"{time}"} com {"{dentist}"}. Confirme respondendo SIM."</p>
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
            <span className="text-sm">Cancelar consulta de um paciente (ex: "cancelar Maria")</span>
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
