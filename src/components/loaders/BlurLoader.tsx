import React from 'react';

type Props = {
  show?: boolean;
};

const BlurLoader: React.FC<Props> = ({ show = true }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-xs">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-gray-900"></div>
    </div>
  );
};

export default BlurLoader;
