import { config } from '../config';

/**
 * Utility functions for handling image URLs
 */

/**
 * Converts a relative image URL to a full URL by prefixing with the API base URL
 * @param imageUrl - The image URL (relative or absolute)
 * @returns The full URL if relative, or the original URL if already absolute
 */
export function getFullImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return '';

  // If it's already an absolute URL, return as is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // In development, replace production URLs with localhost
    if (config.IS_DEV && imageUrl.includes('milnagourmetback.onrender.com')) {
      return imageUrl.replace('https://milnagourmetback.onrender.com', 'http://localhost:3000');
    }
    return imageUrl;
  }

  // If it's a relative URL starting with /uploads/, prefix with API URL
  if (imageUrl.startsWith('/uploads/')) {
    return `${config.API_URL}${imageUrl}`;
  }

  // For other relative URLs, return as is (they might be handled differently)
  return imageUrl;
}