import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('getFullImageUrl', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('retourne une chaîne vide pour une valeur nulle, indéfinie ou vide', async () => {
    const { getFullImageUrl } = await import('./imageUtils');

    expect(getFullImageUrl(null)).toBe('');
    expect(getFullImageUrl(undefined)).toBe('');
    expect(getFullImageUrl('')).toBe('');
  });

  it('retourne telle quelle une URL Cloudinary absolue', async () => {
    const { getFullImageUrl } = await import('./imageUtils');
    const cloudinaryUrl = 'https://res.cloudinary.com/iujorfq3/image/upload/milnagourmet/produits/yaourt.jpg';

    expect(getFullImageUrl(cloudinaryUrl)).toBe(cloudinaryUrl);
  });

  it('retourne telle quelle une URL relative qui ne commence pas par /uploads/', async () => {
    const { getFullImageUrl } = await import('./imageUtils');

    expect(getFullImageUrl('/assets/logo.png')).toBe('/assets/logo.png');
  });

  it('préfixe une ancienne URL locale /uploads/ avec API_URL (compatibilité descendante)', async () => {
    vi.doMock('../config', () => ({
      config: { API_URL: 'http://localhost:3000', IS_DEV: false, IS_PROD: true },
    }));
    const { getFullImageUrl } = await import('./imageUtils');

    expect(getFullImageUrl('/uploads/produits/yaourt.jpg')).toBe('http://localhost:3000/uploads/produits/yaourt.jpg');
  });

  it("en dev, remplace l'ancien backend de production par localhost", async () => {
    vi.doMock('../config', () => ({
      config: { API_URL: 'http://localhost:3000', IS_DEV: true, IS_PROD: false },
    }));
    const { getFullImageUrl } = await import('./imageUtils');
    const prodUrl = 'https://milnagourmetback-ujm7.onrender.com/uploads/logos/milna-logo.png';

    expect(getFullImageUrl(prodUrl)).toBe('http://localhost:3000/uploads/logos/milna-logo.png');
  });

  it('ne modifie pas les URL de production hors dev', async () => {
    vi.doMock('../config', () => ({
      config: { API_URL: 'https://milnagourmetback-ujm7.onrender.com', IS_DEV: false, IS_PROD: true },
    }));
    const { getFullImageUrl } = await import('./imageUtils');
    const prodUrl = 'https://milnagourmetback-ujm7.onrender.com/uploads/logos/milna-logo.png';

    expect(getFullImageUrl(prodUrl)).toBe(prodUrl);
  });
});
