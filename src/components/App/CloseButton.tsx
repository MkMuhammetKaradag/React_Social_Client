// CloseButton.tsx
import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';

interface CloseButtonProps {
  onClick: () => void;
}

const CloseButton: React.FC<CloseButtonProps> = ({ onClick }) => (
  <div className="absolute top-0 right-0 p-4">
    <button onClick={onClick} className="text-white text-3xl">
      <AiOutlineClose />
    </button>
  </div>
);

export default CloseButton;