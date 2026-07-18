import { Plus } from 'lucide-react';
import { Testimonial, Product, User as UserType, DeliveryPerson } from '@/types';
import { useTestimonialsManagement } from './hooks/useTestimonialsManagement';
import { TestimonialsStats } from './components/TestimonialsStats';
import { AddTestimonialForm } from './components/AddTestimonialForm';
import { TestimonialCard } from './components/TestimonialCard';

interface TestimonialsTabProps {
  displaySuccessToast: (message: string) => void;
  setDeleteModal: React.Dispatch<React.SetStateAction<{ isOpen: boolean; item?: Product | UserType | DeliveryPerson | Testimonial | { value: string; label: string }; type: 'product' | 'user' | 'deliveryPerson' | 'image' | 'testimonial' }>>;
}

export function TestimonialsTab({ displaySuccessToast, setDeleteModal }: TestimonialsTabProps) {
  const {
    testimonials,
    loading,
    showAddForm,
    setShowAddForm,
    formData,
    fieldErrors,
    submitting,
    handleToggleActive,
    handleInputChange,
    handleSubmit,
    handleAvatarUpload
  } = useTestimonialsManagement(displaySuccessToast);

  const handleDelete = (testimonial: Testimonial) => {
    setDeleteModal({
      isOpen: true,
      item: testimonial,
      type: 'testimonial'
    });
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

      <TestimonialsStats
        total={totalTestimonials}
        approved={approvedTestimonials}
        pending={pendingTestimonials}
      />

      <div className="flex justify-end">
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-2 bg-button border border-button-border text-button-foreground px-4 py-2 rounded-lg hover:bg-button-hover hover:text-button-hover-foreground hover:border-button-hover-border transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Ajouter un témoignage</span>
        </button>
      </div>

      {showAddForm && (
        <AddTestimonialForm
          formData={formData}
          fieldErrors={fieldErrors}
          submitting={submitting}
          onInputChange={handleInputChange}
          onAvatarUpload={handleAvatarUpload}
          onSubmit={handleSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            onToggleActive={handleToggleActive}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
