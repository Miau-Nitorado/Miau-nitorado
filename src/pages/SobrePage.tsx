import { Link } from 'react-router-dom';
import { PawPrint, Target, Lightbulb, Users, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-4xl section-padding py-8 animate-fade-in">
      <div className="text-center mb-10">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-600 text-white mx-auto mb-4">
          <PawPrint size={32} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Sobre o Miau-Nitorado</h1>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">
          Uma plataforma para reunir informações sobre animais perdidos e encontrados.
        </p>
      </div>

      <div className="space-y-6">
        <section className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Target size={24} className="text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">O que é</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            O Miau-Nitorado é uma plataforma web que facilita a divulgação, busca e
            localização de animais de estimação perdidos e encontrados. Centraliza
            informações que normalmente ficam espalhadas em redes sociais, grupos de
            mensagens e outros meios, tornando a busca mais organizada e eficiente.
          </p>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Lightbulb size={24} className="text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Por que foi criado</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Todos os anos, milhares de animais domésticos se perdem no Brasil. A
            fragmentação das informações dificulta o reencontro: uma pessoa encontra
            um animal em uma cidade, enquanto o tutor busca em grupos diferentes,
            plataformas distintas e em momentos diferentes. O Miau-Nitorado propõe
            um espaço único, acessível e gratuito para conectar essas informações.
          </p>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <PawPrint size={24} className="text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Como funciona</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            Usuários cadastram ocorrências de animais perdidos ou encontrados com foto,
            características e localização aproximada. A comunidade pode pesquisar, filtrar
            e entrar em contato com a pessoa responsável pela publicação. Quando o animal
            é localizado, o status é atualizado e a ocorrência é encerrada.
          </p>
          <Link to="/como-funciona" className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1">
            Ver detalhes <ArrowRight size={16} />
          </Link>
        </section>

        <section className="card p-6">
          <div className="flex items-center gap-3 mb-3">
            <Users size={24} className="text-teal-600" />
            <h2 className="text-lg font-bold text-gray-900">Como a comunidade pode colaborar</h2>
          </div>
          <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-disc list-inside">
            <li>Cadastre animais perdidos ou encontrados que você avistou.</li>
            <li>Compartilhe as publicações em redes sociais e grupos de mensagens.</li>
            <li>Filtre e busque animais por cidade, bairro, espécie e características.</li>
            <li>Entre em contato com a pessoa responsável caso reconheça um animal.</li>
            <li>Marque o animal como localizado quando o reencontro acontecer.</li>
          </ul>
        </section>

        <section className="rounded-2xl bg-gray-50 border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-2">Projeto Acadêmico</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Esta é uma solução inicial desenvolvida como Projeto Integrador do curso de
            Engenharia de Computação da UNIVESP (Universidade Virtual do Estado de São Paulo).
            O sistema tem caráter demonstrativo e educacional. Não possui integração com
            órgãos públicos, clínicas veterinárias ou serviços externos. Não utiliza
            inteligência artificial para reconhecimento de animais. Todos os dados exibidos
            na versão de demonstração são fictícios.
          </p>
        </section>
      </div>

      <div className="mt-10 text-center">
        <Link to="/cadastrar">
          <Button>
            <PawPrint size={20} /> Começar agora <ArrowRight size={18} />
          </Button>
        </Link>
      </div>
    </div>
  );
}
