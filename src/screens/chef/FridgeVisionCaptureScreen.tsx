import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, X } from 'lucide-react';
import { Screen } from '../../components/layout/Screen';
import { Button } from '../../components/ui/Button';
import { CameraAlignmentOverlay } from '../../components/chef/CameraAlignmentOverlay';
import type { SelectedMedia } from '../../components/media/MediaPicker';

export function FridgeVisionCaptureScreen() {
  const navigate = useNavigate();
  const [capturedImage, setCapturedImage] = useState<SelectedMedia | null>(null);
  const [showAlignmentOverlay, setShowAlignmentOverlay] = useState(true);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (capturedImage?.url && capturedImage.url.startsWith('blob:')) {
        URL.revokeObjectURL(capturedImage.url);
      }
    };
  }, [capturedImage]);

  const handleCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setCapturedImage({
          url: URL.createObjectURL(file),
          file,
        });
      }
    };
    input.click();
  };

  const handleRemoveImage = () => {
    if (capturedImage?.url && capturedImage.url.startsWith('blob:')) {
      URL.revokeObjectURL(capturedImage.url);
    }
    setCapturedImage(null);
  };

  const handleContinue = () => {
    if (capturedImage) {
      navigate('/chef/fridge/review', {
        state: { imageUri: capturedImage.url },
      });
    }
  };

  return (
    <Screen background="transparent">
      <div className="relative h-screen bg-black">
        {/* Camera Alignment Overlay */}
        {showAlignmentOverlay && !capturedImage && (
          <CameraAlignmentOverlay
            scanType="fridge"
            onDismiss={() => setShowAlignmentOverlay(false)}
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          {capturedImage ? (
            <div className="relative w-full h-full">
              <img
                src={capturedImage.url}
                alt="Fridge photo"
                className="w-full h-full object-contain"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white"
              >
                <X size={24} />
              </button>
            </div>
          ) : (
            <div className="text-white text-center">
              <Camera size={64} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg opacity-75">Capture your fridge</p>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 safe-area-bottom">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white border-white/50"
            >
              Cancel
            </Button>
            
            {capturedImage ? (
              <Button
                variant="primary"
                onClick={handleContinue}
                className="bg-white text-black hover:bg-white/90"
              >
                Analyze
              </Button>
            ) : (
              <button
                onClick={handleCapture}
                className="w-16 h-16 rounded-full bg-white border-4 border-gray-300 active:scale-95 transition-transform"
                aria-label="Capture photo"
              />
            )}
          </div>
        </div>
      </div>
    </Screen>
  );
}

