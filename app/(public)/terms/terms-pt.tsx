"use client"

import Link from "next/link"

export default function TermsPagePt() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link href="/" className="text-lg font-bold text-sky-700">INTER-IA</Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12 prose prose-gray">
        <h1>Termos de Uso</h1>
        <p className="text-sm text-gray-500">Última atualização: 01 de fevereiro de 2026</p>

        <h2>1. Aceite dos Termos</h2>
        <p>
          Ao acessar e usar a plataforma INTER-IA, você concorda com estes Termos de Uso.
          Se não concordar com qualquer parte, não utilize nossos serviços.
        </p>

        <h2>2. Descrição do Serviço</h2>
        <p>
          O INTER-IA é uma plataforma de gestão para clínicas odontológicas que oferece
          funcionalidades de agendamento, gerenciamento de pacientes, prontuário eletrônico,
          comunicação via WhatsApp, e outras ferramentas de gestão clínica.
        </p>

        <h2>3. Cadastro e Conta</h2>
        <p>
          Para utilizar o serviço, é necessário criar uma conta fornecendo informações verdadeiras
          e completas. Você é responsável por manter a confidencialidade de suas credenciais
          de acesso.
        </p>

        <h2>4. Planos e Pagamento</h2>
        <p>
          A plataforma oferece diferentes planos com funcionalidades variadas. O período de teste
          gratuito é de 14 dias. Após o período de teste, é necessário assinar um plano para
          continuar utilizando o serviço.
        </p>

        <h2>5. Proteção de Dados</h2>
        <p>
          Todos os dados armazenados na plataforma são protegidos com criptografia e seguem as
          melhores práticas de segurança da informação. Os dados pertencem ao titular da conta
          e podem ser exportados a qualquer momento.
        </p>

        <h2>6. Responsabilidades do Usuário</h2>
        <ul>
          <li>Manter seus dados cadastrais atualizados</li>
          <li>Não compartilhar credenciais de acesso</li>
          <li>Utilizar o serviço de acordo com a legislação vigente</li>
          <li>Garantir a veracidade das informações inseridas</li>
          <li>Respeitar a privacidade dos pacientes cadastrados</li>
        </ul>

        <h2>7. LGPD e Privacidade</h2>
        <p>
          O INTER-IA está em conformidade com a Lei Geral de Proteção de Dados (LGPD).
          Para mais detalhes sobre como tratamos seus dados, consulte nossa{" "}
          <Link href="/privacy" className="text-sky-600 hover:underline">Política de Privacidade</Link>.
        </p>

        <h2>8. Cancelamento</h2>
        <p>
          Você pode cancelar sua assinatura a qualquer momento. Após o cancelamento, o acesso
          será mantido até o final do período já pago. Seus dados serão mantidos por 90 dias
          após o cancelamento, podendo ser exportados durante esse período.
        </p>

        <h2>9. Exclusão de Dados</h2>
        <p>
          Em conformidade com a LGPD, você pode solicitar a exclusão completa de seus dados
          a qualquer momento através das configurações da conta ou entrando em contato
          com nosso suporte.
        </p>

        <h2>10. Modificações nos Termos</h2>
        <p>
          Reservamo-nos o direito de alterar estes termos a qualquer momento. Alterações
          significativas serão comunicadas por e-mail com antecedência mínima de 30 dias.
        </p>

        <h2>11. Contato</h2>
        <p>
          Para dúvidas sobre estes termos, entre em contato pelo e-mail: contato@marciosager.com
        </p>
      </main>
    </div>
  )
}
