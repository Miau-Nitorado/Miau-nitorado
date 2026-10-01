import { Search, X } from 'lucide-react';

interface AnimalSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AnimalSearch({ value, onChange, placeholder = 'Buscar por nome, raça, cidade...' }: AnimalSearchProps) {
  return (
    <div className="relative">
      <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field pl-11 pr-10"
        aria-label="Buscar animais"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Limpar busca"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
