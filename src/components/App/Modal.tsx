// Modal.tsx
import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode; // children prop'unu ekleyin
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <main className="flex flex-col justify-start  bg-white w-[75vw] h-[75vh] p-4 rounded shadow-lg ">
        <button onClick={onClose} className=" top-2 right-2 text-gray-500">
          &times;
        </button>
        {children}
      </main>
    </div>
  );
};

export default Modal;
