import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

/**
 * Converts a blob URL or File to a data URL (base64) for persistence
 * This is necessary because blob URLs are temporary and become invalid after page refresh
 */
export async function convertToDataURL(blobUrlOrFile: string | File): Promise<string> {
  // If it's already a data URL, return it
  if (typeof blobUrlOrFile === 'string' && blobUrlOrFile.startsWith('data:')) {
    return blobUrlOrFile;
  }

  try {
    let blob: Blob;
    
    if (blobUrlOrFile instanceof File) {
      blob = blobUrlOrFile;
    } else if (typeof blobUrlOrFile === 'string' && blobUrlOrFile.startsWith('blob:')) {
      // Fetch the blob from the blob URL
      const response = await fetch(blobUrlOrFile);
      blob = await response.blob();
    } else {
      // If it's not a blob URL or file, return as-is (might be a regular URL)
      return blobUrlOrFile;
    }

    // Convert blob to data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert blob to data URL'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting to data URL:', error);
    // Return original if conversion fails
    return typeof blobUrlOrFile === 'string' ? blobUrlOrFile : '';
  }
}

