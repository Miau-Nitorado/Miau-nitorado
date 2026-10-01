import { Link } from 'react-router-dom';
import { PawPrint } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md section-padding py-16 text-center animate-fade-in">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 mx-auto mb-4">
        <PawPrint size={32} />
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Página não encontrada</h1>
      <p className="text-sm text-gray-500 mb-6">
        A página que você procura não existe ou foi movida.
      </p>
      <Link to="/">
        <Button>Voltar para o início</Button>
      </Link>
    </div>
  );
}
