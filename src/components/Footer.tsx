import { Link } from 'react-router-dom';
import { PawPrint, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="mx-auto max-w-7xl section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
                <PawPrint size={22} />
              </div>
              <span className="text-lg font-extrabold text-white">
                Miau<span className="text-teal-400">-Nitorado</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
              Conectando pessoas para ajudar animais a voltarem para casa.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Navegação</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-teal-400 transition-colors">Início</Link></li>
              <li><Link to="/animais-perdidos" className="hover:text-teal-400 transition-colors">Animais Perdidos</Link></li>
              <li><Link to="/animais-encontrados" className="hover:text-teal-400 transition-colors">Animais Encontrados</Link></li>
              <li><Link to="/sobre" className="hover:text-teal-400 transition-colors">Sobre</Link></li>
              <li><Link to="/privacidade" className="hover:text-teal-400 transition-colors">Privacidade</Link></li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3">Sobre o projeto</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Plataforma desenvolvida como Projeto Integrador do curso de
              Engenharia de Computação da UNIVESP. Tem caráter acadêmico e
              demonstra uma solução inicial para o problema de animais
              perdidos e encontrados.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} Miau-Nitorado — Projeto Acadêmico UNIVESP
          </p>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            Feito com <Heart size={12} className="text-teal-400 fill-teal-400" /> para ajudar animais
          </p>
        </div>
      </div>
    </footer>
  );
}
