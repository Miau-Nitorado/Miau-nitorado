import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PawPrint, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      navigate('/minhas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login.');
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
        <h1 className="text-2xl font-bold text-gray-900">Entrar</h1>
        <p className="text-sm text-gray-500 mt-1">Acesse sua conta para gerenciar suas publicações</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4">
        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {error}
          </div>
        )}

        <Input
          label="E-mail"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
        />
        <Input
          label="Senha"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
        />

        <Button type="submit" fullWidth disabled={loading}>
          <LogIn size={18} /> {loading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-sm text-gray-500">
          Não tem conta?{' '}
          <Link to="/cadastro" className="font-semibold text-teal-600 hover:text-teal-700">
            Criar conta
          </Link>
        </p>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        Autenticação simulada para demonstração. Os dados ficam apenas no seu navegador.
      </p>
    </div>
  );
}
