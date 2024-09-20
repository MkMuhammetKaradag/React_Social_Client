// SlidingPanel.tsx
import React from 'react';

interface SlidingPanelProps {
  isOpen: boolean;

  position: 'left' | 'right';
  children: React.ReactNode;
}

const SlidingPanel: React.FC<SlidingPanelProps> = ({
  isOpen,

  position,
  children,
}) => {
  return (
    <div
      className={`fixed ml-16 top-0 ${position}-0 h-full flex flex-col w-80 bg-gray-900 text-white p-4 transition-all duration-500 transform ${
        isOpen
          ? 'translate-x-0'
          : position === 'left'
          ? '-translate-x-[calc(100%+4rem)]'
          : 'translate-x-full'
      }`}
    >
      {/* <button onClick={onClose} className="absolute top-2 right-2 text-white">
        Kapat
      </button> */}
      {children}
    </div>
  );
};

export default SlidingPanel;
