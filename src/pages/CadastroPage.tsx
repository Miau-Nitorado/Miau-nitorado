import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  PawPrint,
  ImagePlus,
  X,
  AlertCircle,
} from 'lucide-react';
import type { AnimalFormData, AnimalType } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import * as animalService from '@/services/animalService';
import { generateId } from '@/utils';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';

const STEPS = [
  { num: 1, title: 'Informações básicas' },
  { num: 2, title: 'Características' },
  { num: 3, title: 'Local e data' },
  { num: 4, title: 'Contato' },
  { num: 5, title: 'Revisão' },
];

const speciesOptions = [
  { value: 'Cachorro', label: 'Cachorro' },
  { value: 'Gato', label: 'Gato' },
  { value: 'Pássaro', label: 'Pássaro' },
  { value: 'Coelho', label: 'Coelho' },
  { value: 'Outro', label: 'Outro' },
];
const sexOptions = [
  { value: 'Macho', label: 'Macho' },
  { value: 'Fêmea', label: 'Fêmea' },
  { value: 'Desconhecido', label: 'Desconhecido' },
];
const sizeOptions = [
  { value: 'Pequeno', label: 'Pequeno' },
  { value: 'Médio', label: 'Médio' },
  { value: 'Grande', label: 'Grande' },
];
const contactMethodOptions = [
  { value: 'telefone', label: 'Telefone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'E-mail' },
];

const emptyForm: AnimalFormData = {
  name: '', species: '', breed: '', sex: '', age: '', size: '', color: '',
  characteristics: '', particularCharacteristics: '', hasCollar: false,
  collarDescription: '', hasMicrochip: false, photos: [], type: 'perdido',
  date: '', time: '', city: '', neighborhood: '', reference: '', description: '',
  additionalInfo: '', contactName: '', contactPhone: '', contactEmail: '',
  contactMethod: 'telefone',
};

export default function CadastroPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<AnimalFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);

  // Define tipo a partir da URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const typeParam = params.get('type') as AnimalType | null;
    if (typeParam === 'perdido' || typeParam === 'encontrado') {
      setForm((f) => ({ ...f, type: typeParam }));
    }
  }, []);

  // Modo edição: carregar ocorrência existente
  useEffect(() => {
    if (!id) return;
    setLoadingEdit(true);
    animalService.getOccurrenceById(id).then((occ) => {
      if (!occ) { showToast('Ocorrência não encontrada.', 'error'); navigate('/minhas'); return; }
      setForm({
        name: occ.animal.name === 'Sem identificação' ? '' : occ.animal.name,
        species: occ.animal.species, breed: occ.animal.breed, sex: occ.animal.sex,
        age: occ.animal.age, size: occ.animal.size, color: occ.animal.color,
        characteristics: occ.animal.characteristics,
        particularCharacteristics: occ.animal.particularCharacteristics,
        hasCollar: occ.animal.hasCollar, collarDescription: occ.animal.collarDescription || '',
        hasMicrochip: occ.animal.hasMicrochip, photos: occ.animal.photos,
        type: occ.type, date: occ.date, time: occ.time,
        city: occ.location.city, neighborhood: occ.location.neighborhood,
        reference: occ.location.reference || '', description: occ.description,
        additionalInfo: occ.additionalInfo || '', contactName: occ.contact.name,
        contactPhone: occ.contact.phone, contactEmail: occ.contact.email || '',
        contactMethod: occ.contact.preferredMethod,
      });
      setLoadingEdit(false);
    });
  }, [id, navigate, showToast]);

  // Redireciona se não estiver logado
  useEffect(() => {
    if (!user) {
      showToast('Você precisa estar logado para publicar.', 'info');
      navigate('/login');
    }
  }, [user, navigate, showToast]);

  const update = (key: keyof AnimalFormData, value: string | boolean | AnimalFormData['photos']) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};
    if (s === 1) {
      if (!form.species) e.species = 'Selecione a espécie.';
      if (!form.color) e.color = 'A cor é obrigatória.';
      if (form.type === 'perdido' && !form.name) e.name = 'O nome é obrigatório para animais perdidos.';
    }
    if (s === 2) {
      if (!form.size) e.size = 'Selecione o porte.';
      if (!form.characteristics) e.characteristics = 'Descreva ao menos uma característica física.';
    }
    if (s === 3) {
      if (!form.date) e.date = 'A data é obrigatória.';
      if (!form.city) e.city = 'A cidade é obrigatória.';
      if (!form.neighborhood) e.neighborhood = 'O bairro é obrigatório.';
    }
    if (s === 4) {
      if (!form.contactName) e.contactName = 'O nome de contato é obrigatório.';
      if (!form.contactPhone) e.contactPhone = 'O telefone é obrigatório.';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(s + 1, 5));
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handlePhotoUrl = () => {
    const url = prompt('Cole a URL da foto do animal:');
    if (url && url.trim()) {
      update('photos', [...form.photos, { id: generateId(), url: url.trim(), alt: form.name || 'Animal' }]);
    }
  };

  const removePhoto = (photoId: string) => {
    update('photos', form.photos.filter((p) => p.id !== photoId));
  };

  const handleSubmit = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      if (id) {
        await animalService.updateOccurrence(id, form, user.id);
        showToast('Publicação atualizada com sucesso!', 'success');
        navigate(`/animal/${id}`);
      } else {
        const occ = await animalService.createOccurrence(form, user.id);
        showToast('Publicação criada com sucesso!', 'success');
        navigate(`/animal/${occ.id}`);
      }
    } catch {
      showToast('Ocorreu um erro ao salvar. Tente novamente.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingEdit) {
    return (
      <div className="mx-auto max-w-3xl section-padding py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  const typeLabel = form.type === 'perdido' ? 'Animal Perdido' : 'Animal Encontrado';

  return (
    <div className="mx-auto max-w-3xl section-padding py-8 animate-fade-in">
      {/* Voltar */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-teal-600 transition-colors mb-4"
      >
        <ArrowLeft size={18} /> Voltar
      </button>

      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {id ? 'Editar publicação' : 'Cadastrar ocorrência'}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {id ? 'Atualize as informações da publicação.' : `Preencha as informações sobre o ${typeLabel.toLowerCase()}.`}
        </p>
      </div>

      {/* Tipo selector (apenas para novo cadastro) */}
      {!id && (
        <div className="mb-6 flex gap-2 rounded-2xl bg-gray-100 p-1.5">
          <button
            onClick={() => update('type', 'perdido')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              form.type === 'perdido' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <PawPrint size={16} className="inline mr-1" /> Animal Perdido
          </button>
          <button
            onClick={() => update('type', 'encontrado')}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold transition-all ${
              form.type === 'encontrado' ? 'bg-white text-amber-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            <Check size={16} className="inline mr-1" /> Animal Encontrado
          </button>
        </div>
      )}

      {/* Stepper */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s.num} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                    step > s.num
                      ? 'bg-teal-600 text-white'
                      : step === s.num
                      ? 'bg-teal-600 text-white ring-4 ring-teal-100'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step > s.num ? <Check size={18} /> : s.num}
                </div>
                <span className={`hidden sm:block mt-1 text-xs font-semibold ${step >= s.num ? 'text-gray-900' : 'text-gray-400'}`}>
                  {s.title}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 transition-all ${step > s.num ? 'bg-teal-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form steps */}
      <div className="card p-5 sm:p-6">
        {/* Etapa 1: Informações básicas */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Informações básicas</h2>

            {/* Fotos */}
            <div>
              <label className="label-field">Fotos do animal</label>
              <div className="flex flex-wrap gap-3">
                {form.photos.map((photo) => (
                  <div key={photo.id} className="relative h-24 w-24 rounded-xl overflow-hidden border border-gray-200">
                    <img src={photo.url} alt={photo.alt} className="h-full w-full object-cover" />
                    <button
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                      aria-label="Remover foto"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={handlePhotoUrl}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-300 text-gray-400 hover:border-teal-400 hover:text-teal-600 transition-colors"
                >
                  <ImagePlus size={24} />
                  <span className="text-xs font-semibold">Adicionar</span>
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">Adicione a URL de uma foto. Em uma versão futura, será possível fazer upload direto.</p>
            </div>

            {form.type === 'perdido' && (
              <Input label="Nome do animal" required value={form.name} onChange={(e) => update('name', e.target.value)} error={errors.name} placeholder="Ex: Thor" />
            )}
            {form.type === 'encontrado' && (
              <Input label="Nome (se conhecido)" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Deixe em branco se desconhecido" hint="Se o nome não for conhecido, será exibido como 'Sem identificação'." />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Espécie" required value={form.species} onChange={(e) => update('species', e.target.value)} error={errors.species} placeholder="Selecione" options={speciesOptions} />
              <Input label="Raça" value={form.breed} onChange={(e) => update('breed', e.target.value)} placeholder="Ex: Pastor Alemão, SRD..." />
              <Select label="Sexo" value={form.sex} onChange={(e) => update('sex', e.target.value)} placeholder="Selecione" options={sexOptions} />
              <Input label="Idade aproximada" value={form.age} onChange={(e) => update('age', e.target.value)} placeholder="Ex: 3 anos, 6 meses" />
            </div>
          </div>
        )}

        {/* Etapa 2: Características */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Características</h2>

            {form.type === 'encontrado' && (
              <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3 mb-2">
                <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800">
                  Descreva apenas características observacionais. Não faça diagnósticos veterinários
                  nem afirme condições médicas sem avaliação profissional.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select label="Porte" required value={form.size} onChange={(e) => update('size', e.target.value)} error={errors.size} placeholder="Selecione" options={sizeOptions} />
              <Input label="Cor da pelagem" required value={form.color} onChange={(e) => update('color', e.target.value)} error={errors.color} placeholder="Ex: Preto e marrom" />
            </div>

            <Textarea label="Características físicas" required value={form.characteristics} onChange={(e) => update('characteristics', e.target.value)} error={errors.characteristics} placeholder="Ex: Pelagem curta, orelhas em pé, corpo robusto..." />

            <Textarea label="Características particulares" value={form.particularCharacteristics} onChange={(e) => update('particularCharacteristics', e.target.value)} placeholder="Ex: Cicatriz na pata, mancha branca no peito..." hint="Detalhes que ajudam a identificar o animal." />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Usa coleira?</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="hasCollar" checked={form.hasCollar} onChange={() => update('hasCollar', true)} className="focus:ring-teal-400" /> Sim
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="hasCollar" checked={!form.hasCollar} onChange={() => update('hasCollar', false)} className="focus:ring-teal-400" /> Não
                  </label>
                </div>
              </div>
              <div>
                <label className="label-field">Possui microchip?</label>
                <div className="flex gap-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="hasMicrochip" checked={form.hasMicrochip} onChange={() => update('hasMicrochip', true)} className="focus:ring-teal-400" /> Sim
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" name="hasMicrochip" checked={!form.hasMicrochip} onChange={() => update('hasMicrochip', false)} className="focus:ring-teal-400" /> Não
                  </label>
                </div>
              </div>
            </div>

            {form.hasCollar && (
              <Input label="Informações da coleira" value={form.collarDescription} onChange={(e) => update('collarDescription', e.target.value)} placeholder="Ex: Coleira vermelha com placa de identificação" />
            )}
          </div>
        )}

        {/* Etapa 3: Local e data */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Local e data</h2>

            <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-3">
              <AlertCircle size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <p className="text-xs text-blue-800">
                Por segurança, não é necessário divulgar seu endereço residencial exato.
                Informe uma localização aproximada (bairro, ponto de referência).
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label={form.type === 'perdido' ? 'Data do desaparecimento' : 'Data em que foi encontrado'}
                required type="date" value={form.date} onChange={(e) => update('date', e.target.value)} error={errors.date}
              />
              <Input label="Horário aproximado" type="time" value={form.time} onChange={(e) => update('time', e.target.value)} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Cidade" required value={form.city} onChange={(e) => update('city', e.target.value)} error={errors.city} placeholder="Ex: Taubaté" />
              <Input label="Bairro" required value={form.neighborhood} onChange={(e) => update('neighborhood', e.target.value)} error={errors.neighborhood} placeholder="Ex: Jardim das Nações" />
            </div>

            <Input label="Local de referência" value={form.reference} onChange={(e) => update('reference', e.target.value)} placeholder="Ex: Próximo à praça Santa Terezinha" hint="Um ponto de referência público ajuda sem expor seu endereço." />

            <Textarea label="Descrição detalhada" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Conte o que aconteceu, comportamento do animal, etc." />

            <Textarea label="Informações adicionais" value={form.additionalInfo} onChange={(e) => update('additionalInfo', e.target.value)} placeholder="Qualquer informação relevante (recompensa, medicação necessária, etc.)" />
          </div>
        )}

        {/* Etapa 4: Contato */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Contato</h2>
            <p className="text-sm text-gray-500">Como as pessoas podem entrar em contato com você sobre esta ocorrência.</p>

            <Input label="Nome para contato" required value={form.contactName} onChange={(e) => update('contactName', e.target.value)} error={errors.contactName} placeholder="Seu nome" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Telefone" required value={form.contactPhone} onChange={(e) => update('contactPhone', e.target.value)} error={errors.contactPhone} placeholder="(12) 99999-9999" />
              <Input label="E-mail (opcional)" type="email" value={form.contactEmail} onChange={(e) => update('contactEmail', e.target.value)} placeholder="seu@email.com" />
            </div>

            <Select label="Forma de contato preferida" value={form.contactMethod} onChange={(e) => update('contactMethod', e.target.value as AnimalFormData['contactMethod'])} options={contactMethodOptions} />

            <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3">
              <AlertCircle size={16} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-800">
                Suas informações de contato aparecerão apenas quando alguém clicar em
                "Entrar em contato" na página do animal. Não divulgue dados sensíveis.
              </p>
            </div>
          </div>
        )}

        {/* Etapa 5: Revisão */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <h2 className="text-lg font-bold text-gray-900">Revisão da publicação</h2>
            <p className="text-sm text-gray-500">Confira as informações antes de publicar.</p>

            {/* Prévia do card */}
            <div className="card overflow-hidden max-w-sm mx-auto">
              <div className="relative aspect-[4/3] bg-gray-100">
                {form.photos[0]?.url ? (
                  <img src={form.photos[0].url} alt={form.photos[0].alt} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-400">
                    <PawPrint size={48} />
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <StatusBadge status={form.type === 'perdido' ? 'perdido' : 'encontrado'} size="md" />
                </div>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="font-bold text-gray-900">{form.name || 'Sem identificação'}</h3>
                <p className="text-sm text-gray-500">{form.species || '—'} • {form.breed || 'Não informada'}</p>
                <p className="text-sm text-gray-500">{form.city || '—'} / {form.neighborhood || '—'}</p>
                <p className="text-sm text-gray-500">{form.date || '—'}</p>
              </div>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <ReviewItem label="Espécie" value={form.species} />
              <ReviewItem label="Raça" value={form.breed} />
              <ReviewItem label="Sexo" value={form.sex} />
              <ReviewItem label="Idade" value={form.age} />
              <ReviewItem label="Porte" value={form.size} />
              <ReviewItem label="Cor" value={form.color} />
              <ReviewItem label="Cidade" value={form.city} />
              <ReviewItem label="Bairro" value={form.neighborhood} />
              <ReviewItem label="Data" value={form.date} />
              <ReviewItem label="Contato" value={form.contactName} />
            </div>

            {form.characteristics && (
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <span className="font-semibold text-gray-700">Características: </span>
                <span className="text-gray-600">{form.characteristics}</span>
              </div>
            )}
            {form.description && (
              <div className="rounded-xl bg-gray-50 p-3 text-sm">
                <span className="font-semibold text-gray-700">Descrição: </span>
                <span className="text-gray-600">{form.description}</span>
              </div>
            )}
          </div>
        )}

        {/* Navegação entre etapas */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
          {step > 1 ? (
            <Button variant="secondary" onClick={prev}>
              <ArrowLeft size={18} /> Voltar
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button onClick={next}>
              Próximo <ArrowRight size={18} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitting}>
              <Check size={18} /> {id ? 'Salvar alterações' : 'Publicar ocorrência'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{value || '—'}</span>
    </div>
  );
}
