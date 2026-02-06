"use client"

import Link from "next/link"

export default function PrivacyPagePt() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-lg font-bold text-sky-700">INTER-IA</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1>Política de Privacidade</h1>
        <p className="text-sm text-gray-500">Última atualização: 01 de fevereiro de 2026</p>

        <h2>1. Introdução</h2>
        <p>
          A INTER-IA respeita a privacidade dos seus usuários e está comprometida com a
          proteção dos dados pessoais. Esta política descreve como coletamos, usamos e
          protegemos suas informações, em conformidade com a Lei Geral de Proteção de Dados
          (LGPD - Lei nº 13.709/2018).
        </p>

        <h2>2. Dados Coletados</h2>
        <h3>2.1 Dados do Usuário (Profissional)</h3>
        <ul>
          <li>Nome, e-mail, telefone</li>
          <li>CNPJ e dados da clínica</li>
          <li>Dados de acesso (credenciais)</li>
          <li>Dados de uso da plataforma</li>
        </ul>

        <h3>2.2 Dados de Pacientes</h3>
        <ul>
          <li>Nome, telefone, CPF, e-mail</li>
          <li>Data de nascimento, endereço</li>
          <li>Histórico de consultas e tratamentos</li>
          <li>Prontuário e anotações clínicas</li>
          <li>Dados de anamnese e odontograma</li>
        </ul>

        <h2>3. Finalidade do Tratamento</h2>
        <p>Os dados são coletados para:</p>
        <ul>
          <li>Prestação do serviço de gestão clínica</li>
          <li>Agendamento e comunicação com pacientes</li>
          <li>Emissão de receituários e documentos clínicos</li>
          <li>Envio de lembretes e notificações</li>
          <li>Geração de relatórios financeiros e operacionais</li>
          <li>Melhoria contínua da plataforma</li>
        </ul>

        <h2>4. Base Legal</h2>
        <p>
          O tratamento dos dados é realizado com base no consentimento do usuário,
          na execução de contrato, no cumprimento de obrigação legal e no legítimo interesse.
        </p>

        <h2>5. Compartilhamento de Dados</h2>
        <p>
          Não vendemos, alugamos ou compartilhamos dados pessoais com terceiros,
          exceto quando necessário para:
        </p>
        <ul>
          <li>Processamento de pagamentos (gateways de pagamento)</li>
          <li>Envio de mensagens (WhatsApp API)</li>
          <li>Emissão de notas fiscais</li>
          <li>Cumprimento de obrigação legal</li>
        </ul>

        <h2>6. Segurança dos Dados</h2>
        <p>Adotamos medidas de segurança que incluem:</p>
        <ul>
          <li>Criptografia de dados em trânsito (HTTPS/TLS)</li>
          <li>Criptografia de senhas (bcrypt)</li>
          <li>Autenticação de dois fatores (2FA)</li>
          <li>Controle de acesso por perfil (RBAC)</li>
          <li>Logs de auditoria</li>
          <li>Backups regulares</li>
        </ul>

        <h2>7. Direitos do Titular</h2>
        <p>Em conformidade com a LGPD, você tem direito a:</p>
        <ul>
          <li>Acesso aos seus dados pessoais</li>
          <li>Correção de dados incompletos ou desatualizados</li>
          <li>Portabilidade dos dados</li>
          <li>Eliminação dos dados pessoais</li>
          <li>Revogação do consentimento</li>
          <li>Informação sobre compartilhamento de dados</li>
        </ul>

        <h2>8. Retenção de Dados</h2>
        <p>
          Os dados são mantidos enquanto a conta estiver ativa. Após o cancelamento,
          os dados são mantidos por 90 dias para possível reativação, sendo excluídos
          permanentemente após esse período, exceto quando houver obrigação legal de
          retenção.
        </p>

        <h2>9. Cookies</h2>
        <p>
          Utilizamos cookies essenciais para o funcionamento da plataforma e cookies
          de sessão para manter o login. Não utilizamos cookies de rastreamento de terceiros.
        </p>

        <h2>10. Contato do Encarregado (DPO)</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de dados,
          entre em contato: contato@marciosager.com
        </p>
      </main>
    </div>
  )
}
