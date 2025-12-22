import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, CheckCircle } from 'lucide-react';
import { StatCard } from './StatCard';
import { siteService } from '@/services/siteService';

interface GalleryTabProps {
  displaySuccessToast: (message: string) => void;
  setDeleteModal: (modal: { isOpen: boolean; item?: ModalImageItem; type: 'image' }) => void;
  reloadTrigger: number;
}

interface GalleryImageItem {
  src: string;
  name: string;
  displayName: string;
  isActive: boolean;
}

interface ModalImageItem {
  value: string;
  label: string;
}

interface CategoryImages {
  category: string;
  images: GalleryImageItem[];
}

export function GalleryTab({ displaySuccessToast, setDeleteModal, reloadTrigger }: GalleryTabProps) {
  const [images, setImages] = useState<CategoryImages[]>([]);
  const [loading, setLoading] = useState(true);

  const loadImages = async () => {
    setLoading(true);
    try {
      // Récupérer les images utilisées
      const usedImagesResponse = await siteService.getUsedImages();
      console.log('Réponse API getUsedImages:', usedImagesResponse);
      const usedImages: string[] = usedImagesResponse.status === 'success' && Array.isArray(usedImagesResponse.data) ? usedImagesResponse.data : [];
      console.log('Images utilisées:', usedImages);

      // Récupérer toutes les images disponibles depuis l'API
      const imagesResponse = await siteService.listImages();
      console.log('Réponse API listImages:', imagesResponse);

      if (imagesResponse.status === 'success' && Array.isArray(imagesResponse.data)) {
        const allImagesData = imagesResponse.data as { value: string; label: string; isUsed?: boolean }[];

        // Grouper par catégorie basée sur le chemin
        const categoryMap: { [key: string]: GalleryImageItem[] } = {
          'Bannière': [],
          'Logos': [],
          'Produits': [],
          'Création': [],
          'Témoignages': [],
          'Catégories': [],
          'Fruits': [],
          'Sauces': [],
          'Céréales': [],
          'Avatars': []
        };

        allImagesData.forEach(image => {
          let category = 'Autres';
          if (image.value.includes('/uploads/banners/')) category = 'Bannière';
          else if (image.value.includes('/uploads/logos/')) category = 'Logos';
          else if (image.value.includes('/uploads/produits/')) category = 'Produits';
          else if (image.value.includes('/uploads/creation/')) category = 'Création';
          else if (image.value.includes('/uploads/temoignages/')) category = 'Témoignages';
          else if (image.value.includes('/uploads/categories/')) category = 'Catégories';
          else if (image.value.includes('/uploads/fruits/')) category = 'Fruits';
          else if (image.value.includes('/uploads/sauces/')) category = 'Sauces';
          else if (image.value.includes('/uploads/cereales/')) category = 'Céréales';
          else if (image.value.includes('/uploads/avatarToast/')) category = 'Avatars';

          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
          categoryMap[category].push({
            src: `${API_URL}${image.value}`,
            name: image.value.split('/').pop() || '',
            displayName: image.label,
            isActive: usedImages.includes(image.value)
          });
        });

        const allImages: CategoryImages[] = Object.entries(categoryMap)
          .filter(([_, images]) => images.length > 0)
          .map(([category, images]) => ({ category, images }));

        console.log('Images organisées par catégorie:', allImages);
        setImages(allImages);
      } else {
        console.error('Erreur lors de la récupération des images:', imagesResponse);
        setImages([]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      setImages([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadImages();
  }, [reloadTrigger]);


  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Galerie d'images</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Chargement des images...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h2 className="text-xl sm:text-2xl font-bold">Galerie d'images</h2>
        <p className="text-sm text-muted-foreground">
          Gérez les images des assets par catégorie
        </p>
      </div>

      {/* Statistiques */}
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total d'images"
          value={images.reduce((sum, cat) => sum + cat.images.length, 0)}
          icon={ImageIcon}
          color="hover:shadow-blue-500/10"
        />
      </div>

      {images.every(cat => cat.images.length === 0) ? (
        <div className="text-center py-12">
          <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">Aucune image trouvée</h3>
          <p className="text-sm text-muted-foreground">
            Les images des assets apparaîtront ici.
          </p>
        </div>
      ) : (
        images.map(cat => (
          <div key={cat.category} className="space-y-4">
            <h3 className="text-lg font-semibold">{cat.category}</h3>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {cat.images.map((image, index) => (
                <div key={index} className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-muted relative group">
                    <img
                      src={image.src}
                      alt={image.displayName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJDMTMuMSAyIDE0IDIuOSAxNCA0VjE2QzE0IDE3LjEgMTMuMSAxOCA5IDE4QzQuOSAxOCA0IDE3LjEgNCAxNlY0QzQgMi45IDQuOSAyIDYgMkMxMC4yIDIgMTIgMkoiIGZpbGw9IiM5Q0E0QUYiLz4KPHBhdGggZD0iTTE1IDlIMTlWMTRIMTU5IiBmaWxsPSIjOUNBNEFGIi8+Cjwvc3ZnPgo=';
                      }}
                    />
                    {image.isActive && (
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Actif
                      </div>
                    )}
                    <button
                      onClick={() => setDeleteModal({
                        isOpen: true,
                        item: {
                          value: image.src.replace(`${import.meta.env.VITE_API_URL}`, ''), // full path like /uploads/folder/filename.jpg
                          label: image.displayName // display name
                        } as ModalImageItem,
                        type: 'image'
                      })}
                      disabled={image.isActive}
                      className={`absolute top-2 right-2 p-1.5 rounded-full transition-opacity duration-200 ${
                        image.isActive
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                          : 'bg-red-500 hover:bg-red-600 text-white opacity-100'
                      }`}
                      title={image.isActive ? "Impossible de supprimer une image active" : "Supprimer l'image"}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-foreground truncate" title={image.displayName}>
                      {image.displayName}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}