import React, { useState, useEffect } from 'react';
import { Star, Check, X, MapPin, Calendar, User, Ban, MessageSquare, CheckCircle, Clock } from 'lucide-react';
import { Testimonial } from '@/types';
import { siteService } from '@/services/siteService';
import { StatCard } from './StatCard';

interface TestimonialsTabProps {
  displaySuccessToast: (message: string) => void;
}

export function TestimonialsTab({ displaySuccessToast }: TestimonialsTabProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      const response = await siteService.getAllTestimonials();
      setTestimonials(response.data as Testimonial[]);
    } catch (error) {
      console.error('Erreur lors du chargement des témoignages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleToggleActive = async (testimonial: Testimonial) => {
    try {
      await siteService.updateTestimonial(testimonial.id, {
        active: !testimonial.active
      });
      displaySuccessToast(`Témoignage ${!testimonial.active ? 'activé' : 'désactivé'}`);
      loadTestimonials();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du témoignage:', error);
    }
  };

  const handleDelete = async (testimonial: Testimonial) => {
    if (!confirm(`Êtes-vous sûr de vouloir refuser et supprimer le témoignage de ${testimonial.name} ?`)) {
      return;
    }

    try {
      await siteService.deleteTestimonial(testimonial.id);
      displaySuccessToast('Témoignage refusé et supprimé');
      loadTestimonials();
    } catch (error) {
      console.error('Erreur lors de la suppression du témoignage:', error);
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Gestion des témoignages</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Chargement des témoignages...</span>
        </div>
      </div>
    );
  }

  // Calcul des statistiques
  const totalTestimonials = testimonials.length;
  const approvedTestimonials = testimonials.filter(t => t.active).length;
  const pendingTestimonials = testimonials.filter(t => !t.active).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold">Modération des témoignages</h2>
        <p className="text-sm text-muted-foreground">
          Accepter ou refuser les témoignages soumis par les clients
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total témoignages"
          value={totalTestimonials}
          icon={MessageSquare}
          color="hover:shadow-blue-500/10"
        />
        <StatCard
          title="Approuvés"
          value={approvedTestimonials}
          icon={CheckCircle}
          color="hover:shadow-green-500/10"
        />
        <StatCard
          title="En attente"
          value={pendingTestimonials}
          icon={Clock}
          color="hover:shadow-orange-500/10"
        />
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header avec avatar, nom, lieu et statut */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  {testimonial.avatar ? (
                    <img
                      src={testimonial.avatar}
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
                  {/* Badge de statut */}
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

            {/* Commentaire */}
            <div className="bg-muted/30 rounded-lg p-4 mb-4">
              <p className="text-foreground leading-relaxed">"{testimonial.comment}"</p>
            </div>

            {/* Footer avec date et actions */}
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
                  onClick={() => handleToggleActive(testimonial)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    testimonial.active
                      ? 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                  }`}
                  title={testimonial.active ? 'Désactiver ce témoignage' : 'Activer ce témoignage'}
                >
                  {testimonial.active ? <Ban className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                </button>
                <button
                  onClick={() => handleDelete(testimonial)}
                  className="p-2 rounded-lg transition-all duration-200 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  title="Refuser et supprimer ce témoignage"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}