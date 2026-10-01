import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageCircle,
  Share2,
  CheckCircle,
  PawPrint,
  HelpCircle,
  Ruler,
  Palette,
  Bone,
  Microchip,
  ShieldAlert,
  Info,
} from 'lucide-react';
import type { AnimalOccurrence } from '@/types';
import * as animalService from '@/services/animalService';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatDate } from '@/utils';
import PhotoGallery from '@/components/PhotoGallery';
import LocationCard from '@/components/LocationCard';
import StatusBadge from '@/components/ui/StatusBadge';
import Button from '@/components/ui/Button';
import ConfirmDialog from '@/components/ui/ConfirmDialog';
import EmptyState from '@/components/EmptyState';

export default function AnimalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [occurrence, setOccurrence] = useState<AnimalOccurrence | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContact, setShowContact] = useState(false);
  const [confirmLocalized, setConfirmLocalized] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    animalService.getOccurrenceById(id).then((data) => {
      setOccurrence(data);
      setLoading(false);
    });
  }, [id]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Miau-Nitorado', url });
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        showToast('Link copiado para a área de transferência!', 'success');
      } catch {
        showToast('Não foi possível copiar o link.', 'error');
      }
    }
  };

  const handleMarkLocalized = async () => {
    if (!occurrence || !user) return;
    const updated = await animalService.updateOccurrenceStatus(occurrence.id, 'localizado', user.id);
    if (updated) {
      setOccurrence(updated);
      showToast('Animal marcado como localizado!', 'success');
    } else {
      showToast('Você não tem permissão para alterar esta publicação.', 'error');
    }
    setConfirmLocalized(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl section-padding py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-32" />
          <div className="h-72 bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-1/2" />
          <div className="h-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!occurrence) {
    return (
      <div className="mx-auto max-w-5xl section-padding py-8">
        <EmptyState
          icon={PawPrint}
          title="Ocorrência não encontrada"
          message="A publicação que você procura pode ter sido removida ou o link está incorreto."
          action={{ label: 'Ver animais perdidos', onClick: () => navigate('/animais-perdidos') }}
        />
      </div>
    );
  }

  const { animal, location, contact } = occurrence;
  const isOwner = user?.id === occurrence.userId;

  const sexIcon = HelpCircle;

  const infoItems = [
    { icon: sexIcon, label: 'Sexo', value: animal.sex },
    { icon: Clock, label: 'Idade', value: animal.age },
    { icon: Ruler, label: 'Porte', value: animal.size },
    { icon: Palette, label: 'Cor', value: animal.color },
  ];

  return (
    <div className="mx-auto max-w-5xl section-padding py-6 animate-fade-in">
      {/* Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors mb-4"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      {/* Status banner */}
      <div className={`mb-4 flex items-center gap-3 rounded-2xl border-2 p-4 ${
        occurrence.status === 'perdido' ? 'border-red-200 bg-red-50' :
        occurrence.status === 'encontrado' ? 'border-amber-200 bg-amber-50' :
        occurrence.status === 'localizado' ? 'border-green-200 bg-green-50' :
        'border-gray-200 bg-gray-50'
      }`}>
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
          occurrence.status === 'perdido' ? 'bg-red-600' :
          occurrence.status === 'encontrado' ? 'bg-amber-600' :
          occurrence.status === 'localizado' ? 'bg-green-600' :
          'bg-gray-500'
        } text-white`}>
          {occurrence.status === 'localizado' ? <CheckCircle size={24} /> : <PawPrint size={24} />}
        </div>
        <div>
          <p className="text-lg font-extrabold text-gray-900">
            {occurrence.status === 'perdido' && 'PERDIDO'}
            {occurrence.status === 'encontrado' && 'ENCONTRADO'}
            {occurrence.status === 'localizado' && 'ANIMAL LOCALIZADO'}
            {occurrence.status === 'encerrado' && 'OCORRÊNCIA ENCERRADA'}
          </p>
          <p className="text-sm text-gray-600">
            {occurrence.type === 'perdido' ? 'Este animal está perdido e procura seu tutor.' : 'Este animal foi encontrado e procura seu tutor.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Galeria */}
          <PhotoGallery photos={animal.photos} alt={`Foto de ${animal.name}`} />

          {/* Informações básicas */}
          <div className="card p-5">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{animal.name}</h1>
            <p className="text-sm text-gray-500 mb-4">{animal.species} • {animal.breed}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {infoItems.map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center rounded-xl bg-gray-50 p-3">
                  <item.icon size={20} className="text-teal-600 mb-1" />
                  <span className="text-xs text-gray-500">{item.label}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Características */}
          <div className="card p-5">
            <h2 className="text-lg font-bold text-gray-900 mb-3">Características</h2>
            <div className="space-y-3 text-sm">
              {animal.characteristics && (
                <div>
                  <span className="font-semibold text-gray-700">Características físicas: </span>
                  <span className="text-gray-600">{animal.characteristics}</span>
                </div>
              )}
              {animal.particularCharacteristics && (
                <div>
                  <span className="font-semibold text-gray-700">Características particulares: </span>
                  <span className="text-gray-600">{animal.particularCharacteristics}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Bone size={16} className="text-teal-600" />
                <span className="font-semibold text-gray-700">Coleira:</span>
                <span className="text-gray-600">
                  {animal.hasCollar ? `Sim${animal.collarDescription ? ` — ${animal.collarDescription}` : ''}` : 'Não'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Microchip size={16} className="text-teal-600" />
                <span className="font-semibold text-gray-700">Microchip:</span>
                <span className="text-gray-600">{animal.hasMicrochip ? 'Sim' : 'Não'}</span>
              </div>
            </div>
          </div>

          {/* Descrição */}
          {occurrence.description && (
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Descrição</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{occurrence.description}</p>
            </div>
          )}

          {/* Informações adicionais */}
          {occurrence.additionalInfo && (
            <div className="card p-5">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Informações adicionais</h2>
              <p className="text-sm text-gray-600 leading-relaxed">{occurrence.additionalInfo}</p>
            </div>
          )}
        </div>

        {/* Coluna lateral */}
        <div className="space-y-6">
          {/* Data e local */}
          <div className="card p-5 space-y-3">
            <h2 className="text-sm font-bold text-gray-900">Data e local</h2>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar size={16} className="text-teal-600" />
              <span>{formatDate(occurrence.date)}</span>
              {occurrence.time && <span>às {occurrence.time}</span>}
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin size={16} className="text-teal-600 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">{location.city}</p>
                <p>{location.neighborhood}</p>
                {location.reference && <p className="text-gray-500 mt-0.5">{location.reference}</p>}
              </div>
            </div>
          </div>

          {/* Mapa */}
          <LocationCard location={location} date={formatDate(occurrence.date)} time={occurrence.time} />

          {/* Contato */}
          <div className="card p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-3">Entrar em contato</h2>
            {!showContact ? (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  As informações de contato são exibidas apenas quando você decide entrar em contato.
                </p>
                <Button fullWidth onClick={() => setShowContact(true)}>
                  <MessageCircle size={18} /> Ver informações de contato
                </Button>
              </div>
            ) : (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-teal-600" />
                  <span className="font-semibold text-gray-900">{contact.name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Phone size={16} className="text-gray-400" />
                  <span>{contact.phone}</span>
                </div>
                {contact.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Mail size={16} className="text-gray-400" />
                    <span>{contact.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-gray-500 pt-1">
                  <Info size={14} /> Contato preferido: {contact.preferredMethod}
                </div>
                <div className="flex gap-2 pt-2">
                  <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="flex-1">
                    <Button variant="secondary" fullWidth>
                      <Phone size={16} /> Ligar
                    </Button>
                  </a>
                  <a
                    href={`https://wa.me/55${contact.phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="primary" fullWidth>
                      <MessageCircle size={16} /> WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="card p-5 space-y-3">
            <Button variant="secondary" fullWidth onClick={handleShare}>
              <Share2 size={18} /> Compartilhar publicação
            </Button>

            {isOwner && occurrence.status !== 'localizado' && occurrence.status !== 'encerrado' && (
              <Button variant="primary" fullWidth onClick={() => setConfirmLocalized(true)}>
                <CheckCircle size={18} /> Animal localizado
              </Button>
            )}

            {isOwner && (
              <div className="pt-2 border-t border-gray-100">
                <Link to={`/cadastrar/${occurrence.id}`}>
                  <Button variant="ghost" fullWidth>
                    Editar publicação
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Aviso de segurança */}
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-4">
            <ShieldAlert size={18} className="text-amber-600 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800 leading-relaxed">
              Nunca divulgue informações sensíveis como endereço residencial exato
              ou dados financeiros. Combine encontros em locais públicos.
            </p>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLocalized}
        title="Confirmar localização"
        message="Tem certeza que deseja marcar este animal como localizado? A ocorrência será encerrada e não aparecerá mais nas listagens ativas."
        confirmLabel="Sim, animal localizado"
        onConfirm={handleMarkLocalized}
        onCancel={() => setConfirmLocalized(false)}
        variant="primary"
      />
    </div>
  );
}
