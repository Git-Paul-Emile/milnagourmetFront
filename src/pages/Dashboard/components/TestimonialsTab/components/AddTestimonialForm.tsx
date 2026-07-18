import { Upload } from 'lucide-react';
import { getFullImageUrl } from '@/utils/imageUtils';

interface TestimonialFormData {
  name: string;
  location: string;
  rating: number;
  comment: string;
  avatar: string;
  active: boolean;
}

interface FieldErrors {
  name?: string;
  location?: string;
  comment?: string;
}

interface AddTestimonialFormProps {
  formData: TestimonialFormData;
  fieldErrors: FieldErrors;
  submitting: boolean;
  onInputChange: (field: keyof TestimonialFormData, value: string | number | boolean) => void;
  onAvatarUpload: (file: File) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export function AddTestimonialForm({
  formData,
  fieldErrors,
  submitting,
  onInputChange,
  onAvatarUpload,
  onSubmit,
  onCancel
}: AddTestimonialFormProps) {
  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau témoignage</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-1">Nom *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${fieldErrors.name ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Lieu *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onInputChange('location', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${fieldErrors.location ? 'border-red-500' : 'border-border'}`}
            />
            {fieldErrors.location && <p className="text-red-500 text-sm mt-1">{fieldErrors.location}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Note *</label>
          <select
            value={formData.rating}
            onChange={(e) => onInputChange('rating', parseInt(e.target.value))}
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
            onChange={(e) => onInputChange('comment', e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${fieldErrors.comment ? 'border-red-500' : 'border-border'}`}
            rows={4}
          />
          {fieldErrors.comment && <p className="text-red-500 text-sm mt-1">{fieldErrors.comment}</p>}
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
                if (file) onAvatarUpload(file);
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
            onChange={(e) => onInputChange('active', e.target.checked)}
            className="rounded border-border"
          />
          <label htmlFor="active-checkbox" className="text-sm font-medium">
            Activer immédiatement ce témoignage
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-button border border-button-border text-button-foreground rounded-lg hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border transition-colors disabled:opacity-50"
          >
            {submitting ? 'Ajout en cours...' : 'Ajouter le témoignage'}
          </button>
        </div>
      </form>
    </div>
  );
}
