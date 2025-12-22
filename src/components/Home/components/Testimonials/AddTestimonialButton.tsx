import { Plus } from 'lucide-react';

interface AddTestimonialButtonProps {
  onClick: () => void;
}

export function AddTestimonialButton({ onClick }: AddTestimonialButtonProps) {
  return (
    <div className="text-center mt-12">
      <button
        onClick={onClick}
        className="inline-flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-full hover:bg-primary/90 transition-colors shadow-lg hover:shadow-xl"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Soumettre un témoignage</span>
      </button>
    </div>
  );
}