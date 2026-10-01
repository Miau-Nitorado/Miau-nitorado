import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  PawPrint,
  Menu,
  X,
  Plus,
  LogOut,
  LayoutGrid,
  User as UserIcon,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Button from './ui/Button';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold transition-colors ${
      isActive ? 'text-teal-600' : 'text-gray-600 hover:text-teal-600'
    }`;

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  const closeMobile = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-100">
      <nav className="mx-auto max-w-7xl section-padding h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0" onClick={closeMobile}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-600 text-white">
            <PawPrint size={22} />
          </div>
          <span className="text-lg font-extrabold text-gray-900 hidden sm:inline">
            Miau<span className="text-teal-600">-Nitorado</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-6">
          <NavLink to="/" className={navLinkClass} end>Início</NavLink>
          <NavLink to="/animais-perdidos" className={navLinkClass}>Perdidos</NavLink>
          <NavLink to="/animais-encontrados" className={navLinkClass}>Encontrados</NavLink>
          <NavLink to="/como-funciona" className={navLinkClass}>Como funciona</NavLink>
          <NavLink to="/sobre" className={navLinkClass}>Sobre</NavLink>
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link to="/cadastrar">
            <Button variant="primary">
              <Plus size={18} /> Publicar ocorrência
            </Button>
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-gray-100 transition-colors"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 text-sm font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-semibold text-gray-700 max-w-[100px] truncate">{user.name}</span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 z-20 w-48 card p-2 animate-scale-in">
                    <Link
                      to="/minhas"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LayoutGrid size={16} /> Minhas Publicações
                    </Link>
                    <Link
                      to="/perfil"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <UserIcon size={16} /> Meu Perfil
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={16} /> Sair
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="secondary">Entrar</Button>
              </Link>
              <Link to="/cadastro">
                <Button variant="primary">Criar conta</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-gray-600 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Abrir menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white animate-fade-in">
          <div className="px-4 py-4 space-y-1">
            <Link to="/" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Início</Link>
            <Link to="/animais-perdidos" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Animais Perdidos</Link>
            <Link to="/animais-encontrados" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Animais Encontrados</Link>
            <Link to="/como-funciona" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Como funciona</Link>
            <Link to="/sobre" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Sobre</Link>
            <hr className="my-2 border-gray-100" />
            <Link to="/cadastrar" onClick={closeMobile} className="block">
              <Button variant="primary" fullWidth>
                <Plus size={18} /> Publicar ocorrência
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/minhas" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Minhas Publicações</Link>
                <Link to="/perfil" onClick={closeMobile} className="block px-3 py-2 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Meu Perfil</Link>
                <button onClick={handleLogout} className="flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50">
                  <LogOut size={16} /> Sair
                </button>
              </>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={closeMobile} className="flex-1">
                  <Button variant="secondary" fullWidth>Entrar</Button>
                </Link>
                <Link to="/cadastro" onClick={closeMobile} className="flex-1">
                  <Button variant="primary" fullWidth>Criar conta</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
