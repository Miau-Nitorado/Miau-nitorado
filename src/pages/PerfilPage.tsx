import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User as UserIcon, Phone, Mail, Calendar, Save, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { formatDateTime } from '@/utils';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function PerfilPage() {
  const { user, updateProfile, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('O nome não pode estar vazio.', 'error');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), phone: phone.trim() });
      showToast('Perfil atualizado com sucesso!', 'success');
    } catch {
      showToast('Erro ao atualizar perfil.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mx-auto max-w-2xl section-padding py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-6">Meu Perfil</h1>

      {/* Info card */}
      <div className="card p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-100 text-teal-700 text-2xl font-extrabold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail size={16} className="text-teal-600" /> {user.email}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} className="text-teal-600" /> {user.phone}
          </div>
        </div>
      </div>

      {/* Edit form */}
      <form onSubmit={handleSave} className="card p-5 sm:p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900">Editar dados</h2>
        <Input label="Nome" required value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(12) 99999-9999" />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Mail size={16} /> E-mail: {user.email} (não editável)
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving}>
            <Save size={18} /> {saving ? 'Salvando...' : 'Salvar alterações'}
          </Button>
          <Button type="button" variant="danger" onClick={handleLogout}>
            <LogOut size={18} /> Sair
          </Button>
        </div>
      </form>
    </div>
  );
}
