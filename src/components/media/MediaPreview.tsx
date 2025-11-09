import React from 'react';

type MediaPreviewProps = {
  url: string;
};

export const MediaPreview: React.FC<MediaPreviewProps> = ({ url }) => {
  return (
    <div className="overflow-hidden rounded-2xl bg-slate-100">
      <img src={url} alt="" className="h-48 w-full object-cover" />
    </div>
  );
};

