import { statusLabel, statusColor } from '@/utils';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border font-bold ${statusColor(status)} ${
        size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      }`}
    >
      {statusLabel(status)}
    </span>
  );
}
