import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { MediaPreview } from './MediaPreview';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import type { SelectedMedia } from './MediaPicker';

type MultiMediaPickerProps = {
  label?: string;
  media: SelectedMedia[];
  onChange: (media: SelectedMedia[]) => void;
  onUpload?: (file: File) => Promise<string>;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  showUploadProgress?: boolean;
};

export const MultiMediaPicker: React.FC<MultiMediaPickerProps> = ({
  label,
  media,
  onChange,
  onUpload,
  accept = 'image/*',
  maxSize = 10,
  maxFiles = 10,
  showUploadProgress = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      media.forEach((item) => {
        if (item.url && item.url.startsWith('blob:')) {
          URL.revokeObjectURL(item.url);
        }
      });
    };
  }, [media]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Check max files limit
    if (media.length + files.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newMedia: SelectedMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file size
      if (maxSize && file.size > maxSize * 1024 * 1024) {
        setError(`File "${file.name}" exceeds ${maxSize}MB limit`);
        continue;
      }

      // Validate file type
      if (accept && !file.type.match(accept.replace('*', '.*'))) {
        setError(`File "${file.name}" type not supported`);
        continue;
      }

      const url = URL.createObjectURL(file);
      const selectedMedia: SelectedMedia = {
        file,
        url,
        uploading: showUploadProgress && !!onUpload,
      };

      newMedia.push(selectedMedia);

      // If upload function provided, upload the file
      if (onUpload) {
        setUploading(true);
        try {
          const uploadedUrl = await onUpload(file);
          selectedMedia.uploadedUrl = uploadedUrl;
          selectedMedia.uploading = false;
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Upload failed';
          selectedMedia.uploading = false;
          selectedMedia.error = errorMessage;
        } finally {
          setUploading(false);
        }
      }
    }

    if (newMedia.length > 0) {
      onChange([...media, ...newMedia]);
      setError(null);
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = (index: number) => {
    const mediaToRemove = media[index];
    if (mediaToRemove.url && mediaToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(mediaToRemove.url);
    }
    const newMedia = media.filter((_, i) => i !== index);
    onChange(newMedia);
    setError(null);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-xs font-medium text-slate-700">{label}</p>}
      
      {error && (
        <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* Media Grid */}
      {media.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {media.map((item, index) => (
            <div key={index} className="relative">
              <MediaPreview url={item.uploadedUrl || item.url} />
              {item.uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
                  <div className="text-center">
                    <LoadingSpinner size={24} />
                    <p className="text-[10px] text-white mt-1">Uploading...</p>
                  </div>
                </div>
              )}
              {item.error && (
                <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center rounded-2xl">
                  <p className="text-[10px] text-white text-center px-1">{item.error}</p>
                </div>
              )}
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white touch-target hover:bg-black/80 transition-colors"
                disabled={item.uploading}
              >
                <X size={12} />
              </button>
              {item.uploadedUrl && (
                <div className="absolute left-1 top-1 rounded-full bg-green-500/80 px-1.5 py-0.5 text-[8px] text-white">
                  ✓
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add More Button */}
      {media.length < maxFiles && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-xs text-slate-500 hover:border-brand-teal hover:bg-brand-bg transition-colors touch-target"
          disabled={uploading}
        >
          <Upload size={20} className="mb-1 text-slate-400" />
          <span className="font-medium">Add {media.length > 0 ? 'more' : 'photos'}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">
            {media.length}/{maxFiles} • {maxSize}MB max
          </span>
        </button>
      )}

      {media.length >= maxFiles && (
        <p className="text-xs text-slate-500 text-center">
          Maximum {maxFiles} files reached
        </p>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={accept.includes('image') ? 'environment' : undefined}
        multiple
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading || media.length >= maxFiles}
      />
    </div>
  );
};

