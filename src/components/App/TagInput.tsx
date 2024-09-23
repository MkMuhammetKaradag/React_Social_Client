import React, { useState, KeyboardEvent, ChangeEvent } from 'react';

interface TagInputProps {
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  tags: string[];
}

const TagInput: React.FC<TagInputProps> = ({ setTags, tags }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      addTags();
    }
  };

  const addTags = () => {
    if (inputValue.trim().length > 2) {
      const newTags = inputValue
        .toLowerCase()
        .split(/[#\s]+/) // Boşluk veya # işaretine göre böl
        .filter((tag) => tag.trim() !== '') // Boş etiketleri filtrele
        .map((tag) => (tag.startsWith('#') ? tag.slice(1) : tag)); // Başındaki # işaretini kaldır

      setTags((prevTags) => [...new Set([...prevTags, ...newTags])]); // Tekrar eden etiketleri önle
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="w-full  mx-auto mt-3">
      <div className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none"
          placeholder="Etiketleri girin (# veya boşlukla ayırın)"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              &times;
            </button>
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
