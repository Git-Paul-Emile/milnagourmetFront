import { MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from '../../StatCard';

interface TestimonialsStatsProps {
  total: number;
  approved: number;
  pending: number;
}

export function TestimonialsStats({ total, approved, pending }: TestimonialsStatsProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total témoignages"
        value={total}
        icon={MessageSquare}
        color="hover:shadow-blue-500/10"
      />
      <StatCard
        title="Approuvés"
        value={approved}
        icon={CheckCircle}
        color="hover:shadow-green-500/10"
      />
      <StatCard
        title="En attente"
        value={pending}
        icon={Clock}
        color="hover:shadow-secondary/10"
      />
    </div>
  );
}
