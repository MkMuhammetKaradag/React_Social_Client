// SearchPanel.tsx
import React, { useState } from 'react';
import SlidingPanel from './SlidingPanel';

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <SlidingPanel isOpen={isOpen} onClose={onClose} position="left">
      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Ara"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 bg-gray-900 text-white border border-gray-700 rounded"
        />
      </div>
      {/* Arama sonuçları */}
      <div className="mt-4">
        {/* Örnek arama sonuçları */}
        <div className="flex items-center mb-2">
          <img
            src="https://via.placeholder.com/40"
            alt="User"
            className="rounded-full mr-2"
          />
          <div>
            <p className="font-bold">Kullanıcı Adı</p>
            <p className="text-sm text-gray-400">Tam Ad</p>
          </div>
        </div>
        {/* Daha fazla sonuç... */}
      </div>
    </SlidingPanel>
  );
};

export default SearchPanel;
