import { Link } from 'react-router-dom';
import {
  Megaphone,
  Share2,
  HeartHandshake,
  PartyPopper,
  ArrowRight,
} from 'lucide-react';
import Button from '@/components/ui/Button';

const steps = [
  { icon: Megaphone, title: 'Cadastre o animal', desc: 'Preencha um formulário simples com foto, características físicas e localização aproximada. Você precisa estar logado para publicar.' },
  { icon: Share2, title: 'Compartilhe as informações', desc: 'Sua publicação fica disponível na plataforma. Use o botão "Compartilhar publicação" para divulgar em redes sociais e grupos de mensagens.' },
  { icon: HeartHandshake, title: 'A comunidade ajuda na busca', desc: 'Pessoas que avistarem o animal podem entrar em contato pelo telefone ou WhatsApp informados na publicação.' },
  { icon: PartyPopper, title: 'Registre o reencontro', desc: 'Quando o animal for localizado, marque a ocorrência como "Animal localizado". Isso encerra a publicação e informa a comunidade.' },
];

export default function ComoFuncionaPage() {
  return (
    <div className="mx-auto max-w-4xl section-padding py-8 animate-fade-in">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Como funciona</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          O Miau-Nitorado facilita a divulgação e busca de animais perdidos e encontrados.
          Veja como usar a plataforma em quatro passos.
        </p>
      </div>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="card p-6 flex flex-col sm:flex-row items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <step.icon size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-white text-xs font-bold">{i + 1}</span>
                <h2 className="text-lg font-bold text-gray-900">{step.title}</h2>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-1">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/cadastrar">
          <Button>
            <Megaphone size={20} /> Publicar ocorrência <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
