import { TESTIMONIAL_CONSTANTS } from './constants';

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  if (!file.type.startsWith('image/')) {
    return { isValid: false, error: 'Veuillez sélectionner un fichier image valide.' };
  }

  if (file.size > TESTIMONIAL_CONSTANTS.MAX_FILE_SIZE) {
    return { isValid: false, error: 'L\'image ne doit pas dépasser 2MB.' };
  }

  return { isValid: true };
};

export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculer les nouvelles dimensions (max 300px de largeur/hauteur)
      const maxSize = TESTIMONIAL_CONSTANTS.MAX_IMAGE_SIZE;
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Dessiner l'image compressée
      ctx?.drawImage(img, 0, 0, width, height);

      // Convertir en base64 avec qualité réduite
      const compressedBase64 = canvas.toDataURL('image/jpeg', TESTIMONIAL_CONSTANTS.IMAGE_QUALITY);
      resolve(compressedBase64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};