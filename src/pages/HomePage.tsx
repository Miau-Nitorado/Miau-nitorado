import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  PawPrint,
  HeartHandshake,
  MapPin,
  Megaphone,
  Home as HomeIcon,
  PartyPopper,
  ArrowRight,
  SearchX,
} from 'lucide-react';
import type { AnimalOccurrence } from '@/types';
import * as animalService from '@/services/animalService';
import { matchesSearch } from '@/utils';
import AnimalGrid from '@/components/AnimalGrid';
import AnimalSearch from '@/components/AnimalSearch';
import EmptyState from '@/components/EmptyState';
import Button from '@/components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState<AnimalOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    animalService.getRecentOccurrences(8).then((data) => {
      setRecent(data);
      setLoading(false);
    });
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('q', search.trim());
    navigate(`/animais-perdidos?${params.toString()}`);
  };

  const searchResults = search.trim() ? recent.filter((o) => matchesSearch(search, o)) : recent;

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-teal-700 to-cyan-800 text-white">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 30%, white 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative mx-auto max-w-7xl section-padding py-16 sm:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold mb-4">
              <PawPrint size={16} /> Projeto Integrador UNIVESP
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight mb-4">
              Ajude a encontrar quem está perdido.
            </h1>
            <p className="text-base sm:text-lg text-teal-50 leading-relaxed mb-8">
              O Miau-Nitorado reúne informações sobre animais perdidos e encontrados
              em um só lugar, facilitando a busca e o reencontro com seus tutores.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/cadastrar?type=encontrado">
                <Button variant="secondary" className="bg-white text-teal-700 border-white hover:bg-teal-50">
                  <HeartHandshake size={20} /> Encontrei um animal
                </Button>
              </Link>
              <Link to="/cadastrar?type=perdido">
                <Button variant="secondary" className="bg-teal-800/40 text-white border-teal-400/30 hover:bg-teal-800/60">
                  <PawPrint size={20} /> Meu animal está perdido
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Busca rápida */}
      <section className="mx-auto max-w-7xl section-padding -mt-8 relative z-10">
        <div className="card p-5 sm:p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Procure por um animal</h2>
          <p className="text-sm text-gray-500 mb-4">
            Busque por nome, espécie, raça, cidade ou características.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <AnimalSearch value={search} onChange={setSearch} placeholder="Ex: Thor, Pastor Alemão, Taubaté..." />
            <Button onClick={handleSearch} className="shrink-0">
              <Search size={18} /> Buscar
            </Button>
          </div>
        </div>
      </section>

      {/* Ocorrências recentes */}
      <section className="mx-auto max-w-7xl section-padding py-12">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Ocorrências recentes</h2>
            <p className="text-sm text-gray-500">Últimos animais cadastrados na plataforma</p>
          </div>
          <Link to="/animais-perdidos" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-teal-600 hover:text-teal-700">
            Ver todos <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : searchResults.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Nenhum animal encontrado"
            message="Não encontramos resultados para sua busca. Tente outros termos."
          />
        ) : (
          <AnimalGrid occurrences={searchResults.slice(0, 8)} />
        )}

        <div className="mt-6 text-center sm:hidden">
          <Link to="/animais-perdidos">
            <Button variant="secondary">Ver todos os animais</Button>
          </Link>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl section-padding">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Como funciona</h2>
            <p className="text-sm text-gray-500">Quatro passos simples para ajudar um animal</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Megaphone, title: '1. Cadastre o animal', desc: 'Preencha as informações com foto, características e localização aproximada.' },
              { icon: PawPrint, title: '2. Compartilhe as informações', desc: 'A publicação fica disponível para toda a comunidade ver e compartilhar.' },
              { icon: HeartHandshake, title: '3. A comunidade ajuda na busca', desc: 'Pessoas que encontrarem o animal podem entrar em contato com você.' },
              { icon: PartyPopper, title: '4. Registre o reencontro', desc: 'Quando o animal for localizado, atualize o status para encerrar a ocorrência.' },
            ].map((step, i) => (
              <div key={i} className="card p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-100 text-teal-600 mx-auto mb-4">
                  <step.icon size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl section-padding py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-cyan-700 text-white p-8 sm:p-12 text-center">
          <HomeIcon size={48} className="mx-auto mb-4 text-teal-200" />
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Vi um animal perdido ou perdeu o seu?</h2>
          <p className="text-teal-50 mb-6 max-w-xl mx-auto">
            Cadastre uma ocorrência agora mesmo. Quanto mais rápido a informação
            for compartilhada, maiores as chances de reencontro.
          </p>
          <Link to="/cadastrar">
            <Button variant="secondary" className="bg-white text-teal-700 border-white hover:bg-teal-50">
              <Megaphone size={20} /> Publicar ocorrência
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
