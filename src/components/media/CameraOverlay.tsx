import React from 'react';

type CameraOverlayProps = {
  onCapture: () => void;
};

export const CameraOverlay: React.FC<CameraOverlayProps> = ({ onCapture }) => {
  // This is UI only; hook up to real camera (getUserMedia / plugin) later.
  return (
    <div className="flex min-h-screen flex-col bg-black/90 text-center text-xs text-white">
      <div className="flex-1 items-center justify-center">
        <div className="mx-auto mt-24 h-72 w-56 rounded-3xl border-4 border-white/60" />
        <p className="mt-3 text-[11px] text-white/70">
          Align your receipt inside the frame.
        </p>
      </div>
      <button
        onClick={onCapture}
        className="mx-auto mb-10 h-16 w-16 rounded-full border-4 border-white bg-white/80 touch-target"
      />
    </div>
  );
};

