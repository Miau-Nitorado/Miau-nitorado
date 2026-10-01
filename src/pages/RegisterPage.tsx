import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, UserPlus, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !phone || !password) {
      setError('Preencha todos os campos obrigatórios.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter ao menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, phone, password);
      navigate('/minhas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar conta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md section-padding py-12 animate-fade-in">
      <div className="text-center mb-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-600 text-white mx-auto mb-3">
          <PawPrint size={28} />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Criar conta</h1>
        <p className="text-sm text-gray-500 mt-1">Cadastre-se para publicar ocorrências</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <Input label="Nome completo" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu nome" />
        <Input label="E-mail" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" />
        <Input label="Telefone" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(12) 99999-9999" />
        <Input label="Senha" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" />
        <Input label="Confirmar senha" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repita a senha" />

        <Button type="submit" fullWidth disabled={loading}>
          <UserPlus size={18} /> {loading ? 'Criando...' : 'Criar conta'}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-700">
            Entrar
          </Link>
        </p>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Autenticação simulada para demonstração. Os dados ficam apenas no seu navegador.
      </p>
    </div>
  );
}
