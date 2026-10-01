import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Eye,
  Pencil,
  Trash2,
  CheckCircle,
  PawPrint,
  SearchX,
  Plus,
} from 'lucide-react';
import type { AnimalOccurrence } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as animalService from '@/services/animalService';
import { formatDate } from '@/utils';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/EmptyState';

type Tab = 'perdidos' | 'encontrados' | 'localizados';

export default function MinhasPublicacoesPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [occurrences, setOccurrences] = useState<AnimalOccurrence[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>('perdidos');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    animalService.getOccurrencesByUser(user.id).then((data) => {
      setOccurrences(data);
      setLoading(false);
    });
  }, [user, navigate]);

  const refresh = () => {
    if (!user) return;
    animalService.getOccurrencesByUser(user.id).then(setOccurrences);
  };

  const handleDelete = async () => {
    if (!deleteId || !user) return;
    const ok = await animalService.deleteOccurrence(deleteId, user.id);
    if (ok) {
      showToast('Publicação excluída com sucesso.', 'success');
      refresh();
    } else {
      showToast('Não foi possível excluir.', 'error');
    }
    setDeleteId(null);
  };

  const handleMarkLocalized = async (id: string) => {
    if (!user) return;
    const updated = await animalService.updateOccurrenceStatus(id, 'localizado', user.id);
    if (updated) {
      showToast('Animal marcado como localizado!', 'success');
      refresh();
    }
  };

  if (!user) return null;

  const filtered = occurrences.filter((o) => {
    if (tab === 'perdidos') return o.type === 'perdido' && o.status === 'perdido';
    if (tab === 'encontrados') return o.type === 'encontrado' && o.status === 'encontrado';
    return o.status === 'localizado' || o.status === 'encerrado';
  });

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: 'perdidos', label: 'Perdidos', count: occurrences.filter((o) => o.type === 'perdido' && o.status === 'perdido').length },
    { key: 'encontrados', label: 'Encontrados', count: occurrences.filter((o) => o.type === 'encontrado' && o.status === 'encontrado').length },
    { key: 'localizados', label: 'Localizados', count: occurrences.filter((o) => o.status === 'localizado' || o.status === 'encerrado').length },
  ];

  return (
    <div className="mx-auto max-w-5xl section-padding py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Minhas Publicações</h1>
          <p className="text-sm text-gray-500 mt-1">Gerencie as ocorrências que você cadastrou</p>
        </div>
        <Link to="/cadastrar">
          <Button>
            <Plus size={18} /> Nova publicação
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl bg-gray-100 p-1.5 mb-6 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold whitespace-nowrap transition-all ${
              tab === t.key ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            {t.label} <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs">{t.count}</span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="flex gap-4">
                <div className="h-24 w-24 bg-gray-200 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="Nenhuma publicação aqui"
          message={tab === 'localizados'
            ? 'Você ainda não marcou nenhum animal como localizado.'
            : 'Você não tem publicações nesta categoria ainda.'}
          action={{ label: 'Publicar ocorrência', onClick: () => navigate('/cadastrar') }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((occ) => {
            const photo = occ.animal.photos[0];
            return (
              <div key={occ.id} className="card p-4 flex flex-col sm:flex-row gap-4">
                {/* Foto */}
                <Link to={`/animal/${occ.id}`} className="shrink-0">
                  <div className="h-24 w-full sm:w-24 rounded-xl overflow-hidden bg-gray-100">
                    {photo?.url ? (
                      <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        <PawPrint size={24} />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <StatusBadge status={occ.status} />
                    <span className="text-xs text-gray-400">{formatDate(occ.date)}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate">{occ.animal.name}</h3>
                  <p className="text-sm text-gray-500 truncate">
                    {occ.animal.species} • {occ.animal.breed} • {occ.location.city}/{occ.location.neighborhood}
                  </p>

                  {/* Ações */}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <Link to={`/animal/${occ.id}`}>
                      <Button variant="ghost" className="text-xs px-2 py-1.5">
                        <Eye size={14} /> Ver
                      </Button>
                    </Link>
                    <Link to={`/cadastrar/${occ.id}`}>
                      <Button variant="ghost" className="text-xs px-2 py-1.5">
                        <Pencil size={14} /> Editar
                      </Button>
                    </Link>
                    {occ.status !== 'localizado' && occ.status !== 'encerrado' && (
                      <Button
                        variant="ghost"
                        className="text-xs px-2 py-1.5 text-green-600 hover:bg-green-50"
                        onClick={() => handleMarkLocalized(occ.id)}
                      >
                        <CheckCircle size={14} /> Marcar como localizado
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      className="text-xs px-2 py-1.5 text-red-600 hover:bg-red-50"
                      onClick={() => setDeleteId(occ.id)}
                    >
                      <Trash2 size={14} /> Excluir
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Excluir publicação"
        message="Tem certeza que deseja excluir esta publicação? Esta ação não pode ser desfeita."
        confirmLabel="Sim, excluir"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
