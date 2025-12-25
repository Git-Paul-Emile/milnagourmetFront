import React, { useState, useEffect } from 'react';
import { Star, Check, X, MapPin, Calendar, User, Ban, MessageSquare, CheckCircle, Clock, Plus, Upload } from 'lucide-react';
import { Testimonial, Product, User as UserType, DeliveryPerson } from '@/types';
import { siteService } from '@/services/siteService';
import { StatCard } from './StatCard';
import { getFullImageUrl } from '@/utils/imageUtils';

interface TestimonialsTabProps {
  displaySuccessToast: (message: string) => void;
  setDeleteModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; item?: Product | UserType | DeliveryPerson | Testimonial | { value: string; label: string }; type: 'product' | 'user' | 'deliveryPerson' | 'image' | 'testimonial' }>>;
}

export function TestimonialsTab({ displaySuccessToast, setDeleteModal }: TestimonialsTabProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    rating: 5,
    comment: '',
    avatar: '',
    active: false
  });
  const [submitting, setSubmitting] = useState(false);

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

  const handleDelete = (testimonial: Testimonial) => {
    setDeleteModal({
      isOpen: true,
      item: testimonial,
      type: 'testimonial'
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await siteService.createTestimonial(formData);
      displaySuccessToast('Témoignage ajouté avec succès');
      setFormData({
        name: '',
        location: '',
        rating: 5,
        comment: '',
        avatar: '',
        active: false
      });
      setShowAddForm(false);
      loadTestimonials();
    } catch (error) {
      console.error('Erreur lors de l\'ajout du témoignage:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    try {
      const response = await siteService.uploadTestimonialImage(file);
      const data = response.data as { path: string; filename: string };
      setFormData(prev => ({ ...prev, avatar: data.path }));
      displaySuccessToast('Image téléchargée avec succès');
    } catch (error) {
      console.error('Erreur lors du téléchargement de l\'image:', error);
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

      {/* Bouton pour ajouter un témoignage */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un témoignage</span>
        </button>
      </div>

      {/* Formulaire d'ajout */}
      {showAddForm && (
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau témoignage</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium mb-1">Nom *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Lieu *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Note *</label>
              <select
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {[1, 2, 3, 4, 5].map(rating => (
                  <option key={rating} value={rating}>{rating} étoile{rating > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Commentaire *</label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full px-3 py-2 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                maxLength={200}
                required
              />
              <p className="text-xs text-muted-foreground mt-1">{formData.comment.length}/200 caractères</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Avatar (optionnel)</label>
              <div className="flex items-center space-x-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleAvatarUpload(file);
                  }}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="flex items-center space-x-2 px-4 py-2 border border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Choisir une image</span>
                </label>
                {formData.avatar && (
                  <img
                    src={getFullImageUrl(formData.avatar)}
                    alt="Avatar preview"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="active-checkbox"
                checked={formData.active}
                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                className="rounded border-border"
              />
              <label htmlFor="active-checkbox" className="text-sm font-medium">
                Activer immédiatement ce témoignage
              </label>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting ? 'Ajout en cours...' : 'Ajouter le témoignage'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow">
            {/* Header avec avatar, nom, lieu et statut */}
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