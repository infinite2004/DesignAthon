import React from 'react';
import { Screen } from '../../../components/layout/Screen';
import { ArrowLeft, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ReceiptCameraScreen: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Screen>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 safe-area-top">
        <div className="flex items-center justify-between px-4 py-3">
          <button 
            className="p-2 -ml-2 touch-target" 
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <h1 className="text-sm font-semibold text-slate-900">Scan Receipt</h1>
          <div className="w-8" />
        </div>
      </header>
      <div className="flex flex-col items-center justify-center flex-1 px-4 py-12">
        <Camera size={64} className="text-gray-400 mb-4" />
        <p className="text-sm text-slate-500 text-center mb-4">
          TODO: Implement camera integration for receipt scanning
        </p>
        <p className="text-xs text-slate-400 text-center">
          This will use device camera to capture receipt and extract items via OCR
        </p>
      </div>
    </Screen>
  );
};

