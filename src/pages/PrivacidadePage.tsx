import { ShieldAlert, MapPin, Phone, Lock, Eye } from 'lucide-react';

export default function PrivacidadePage() {
  const sections = [
    {
      icon: MapPin,
      title: 'Localização aproximada',
      desc: 'Não pedimos nem exibimos seu endereço residencial exato. Use pontos de referência públicos e bairros para indicar a localização do animal.',
    },
    {
      icon: Phone,
      title: 'Informações de contato',
      desc: 'Seus dados de contato (nome, telefone, e-mail) aparecem apenas quando alguém clica em "Entrar em contato" na página de detalhes do animal. Não são exibidos nos cards ou listagens.',
    },
    {
      icon: Eye,
      title: 'Dados visíveis publicamente',
      desc: 'As informações do animal (foto, espécie, raça, características, cidade, bairro) são visíveis para qualquer visitante. Não inclua informações pessoais na descrição.',
    },
    {
      icon: Lock,
      title: 'Autenticação com JWT',
      desc: 'O cadastro e o login são processados pela API do Miau Nitorado. As senhas são gravadas apenas como hash BCrypt — nunca em texto puro — e o acesso é autenticado por token JWT com validade limitada. Seu navegador guarda somente o token da sessão.',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl section-padding py-8 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white mx-auto mb-3">
          <ShieldAlert size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Privacidade e Segurança</h1>
        <p className="text-sm text-gray-500 mt-1">Como protegemos suas informações</p>
      </div>

      <div className="space-y-4">
        {sections.map((s, i) => (
          <div key={i} className="card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
                <s.icon size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 mb-1">{s.title}</h2>
                <p className="text-sm text-gray-600 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-4">
          <ShieldAlert size={18} className="text-amber-600 mt-0.5 shrink-0" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Dica de segurança:</strong> Ao combinar encontros para devolver um
            animal, prefira locais públicos e movimentados. Nunca divulgue dados financeiros
            ou informações sensíveis.
          </p>
        </div>
      </div>
    </div>
  );
}
