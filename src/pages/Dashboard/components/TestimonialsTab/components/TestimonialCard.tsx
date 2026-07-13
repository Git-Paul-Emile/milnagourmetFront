import { Star, Check, X, MapPin, Calendar, User, Ban } from 'lucide-react';
import { Testimonial } from '@/types';
import { getFullImageUrl } from '@/utils/imageUtils';

interface TestimonialCardProps {
  testimonial: Testimonial;
  onToggleActive: (testimonial: Testimonial) => void;
  onDelete: (testimonial: Testimonial) => void;
}

function renderStars(rating: number) {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
    />
  ));
}

export function TestimonialCard({ testimonial, onToggleActive, onDelete }: TestimonialCardProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {testimonial.avatar ? (
              <img
                src={getFullImageUrl(testimonial.avatar)}
                alt={testimonial.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                <span className="text-primary font-semibold text-lg">
                  {testimonial.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
              testimonial.active ? 'bg-green-500' : 'bg-gray-400'
            }`} />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              {testimonial.name}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center">
              <MapPin className="h-3 w-3 mr-1" />
              {testimonial.location}
            </p>
            <div className="flex items-center mt-1">
              {renderStars(testimonial.rating)}
              <span className="ml-2 text-sm text-muted-foreground">
                ({testimonial.rating}/5)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 mb-4">
        <p className="text-foreground leading-relaxed">"{testimonial.comment}"</p>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center text-sm text-muted-foreground">
          <Calendar className="h-4 w-4 mr-2" />
          <span>{new Date(testimonial.date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            testimonial.active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {testimonial.active ? 'Approuvé' : 'En attente'}
          </span>
          <button
            onClick={() => onToggleActive(testimonial)}
            className={`p-2 rounded-lg transition-all duration-200 ${
              testimonial.active
                ? 'bg-secondary/10 text-secondary hover:bg-secondary/20 border border-secondary/20'
                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
            }`}
            title={testimonial.active ? 'Désactiver ce témoignage' : 'Activer ce témoignage'}
          >
            {testimonial.active ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
          </button>
          <button
            onClick={() => onDelete(testimonial)}
            className="p-2 rounded-lg transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
            title="Refuser et supprimer ce témoignage"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
