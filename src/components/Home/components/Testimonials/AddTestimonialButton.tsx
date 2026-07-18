import { Plus } from 'lucide-react';

interface AddTestimonialButtonProps {
  onClick: () => void;
}

export function AddTestimonialButton({ onClick }: AddTestimonialButtonProps) {
  return (
    <div className="text-center mt-12">
      <button
        onClick={onClick}
        className="inline-flex items-center space-x-2 border border-button-border bg-button text-button-foreground px-6 py-3 rounded-full hover:border-button-hover-border hover:bg-button-hover hover:text-button-hover-foreground transition-colors shadow-lg hover:shadow-xl"
      >
        <Plus className="h-5 w-5" />
        <span className="font-medium">Soumettre un témoignage</span>
      </button>
    </div>
  );
}