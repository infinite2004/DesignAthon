import React, { useRef, useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { MediaPreview } from './MediaPreview';
import { LoadingSpinner } from '../ui/LoadingSpinner';

export type SelectedMedia = {
  file: File;
  url: string;
  uploadedUrl?: string; // URL after upload to server
  uploading?: boolean;
  error?: string;
};

type MediaPickerProps = {
  label?: string;
  media?: SelectedMedia | null;
  multiple?: boolean; // Support multiple files
  onChange: (media: SelectedMedia | null) => void;
  onUpload?: (file: File) => Promise<string>; // Optional upload function
  accept?: string; // File types to accept
  maxSize?: number; // Max file size in MB
  showUploadProgress?: boolean;
};

export const MediaPicker: React.FC<MediaPickerProps> = ({
  label,
  media,
  multiple = false,
  onChange,
  onUpload,
  accept = 'image/*',
  maxSize = 10, // 10MB default
  showUploadProgress = false,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (media?.url && media.url.startsWith('blob:')) {
        URL.revokeObjectURL(media.url);
      }
    };
  }, [media]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file size
    if (maxSize && file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace('*', '.*'))) {
      setError(`File type not supported. Please select ${accept}`);
      return;
    }

    setError(null);
    const url = URL.createObjectURL(file);
    
    const selectedMedia: SelectedMedia = {
      file,
      url,
      uploading: showUploadProgress && !!onUpload,
    };

    onChange(selectedMedia);

    // If upload function provided, upload the file
    if (onUpload) {
      setUploading(true);
      try {
        const uploadedUrl = await onUpload(file);
        onChange({
          ...selectedMedia,
          uploadedUrl,
          uploading: false,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Upload failed';
        setError(errorMessage);
        onChange({
          ...selectedMedia,
          uploading: false,
          error: errorMessage,
        });
      } finally {
        setUploading(false);
      }
    }

    // Reset input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    if (media?.url && media.url.startsWith('blob:')) {
      URL.revokeObjectURL(media.url);
    }
    onChange(null);
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

      {media ? (
        <div className="relative">
          <MediaPreview url={media.uploadedUrl || media.url} />
          {media.uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-2xl">
              <div className="text-center">
                <LoadingSpinner size={32} />
                <p className="text-xs text-white mt-2">Uploading...</p>
              </div>
            </div>
          )}
          {media.error && (
            <div className="absolute inset-0 bg-red-500/80 flex items-center justify-center rounded-2xl">
              <p className="text-xs text-white text-center px-2">{media.error}</p>
            </div>
          )}
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-1 text-[10px] text-white touch-target hover:bg-black/80 transition-colors"
            disabled={uploading}
          >
            <X size={12} />
          </button>
          {media.uploadedUrl && (
            <div className="absolute left-2 top-2 rounded-full bg-green-500/80 px-2 py-1 text-[10px] text-white">
              ✓ Uploaded
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-32 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white text-xs text-slate-500 hover:border-brand-teal hover:bg-brand-bg transition-colors touch-target"
        >
          <Upload size={24} className="mb-2 text-slate-400" />
          <span className="font-medium">Tap to upload a photo</span>
          <span className="text-[10px] text-slate-400 mt-1">
            {maxSize}MB max • {accept}
          </span>
        </button>
      )}
      
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture={accept.includes('image') ? 'environment' : undefined}
        multiple={multiple}
        className="hidden"
        onChange={handleFileChange}
        disabled={uploading}
      />
    </div>
  );
};

