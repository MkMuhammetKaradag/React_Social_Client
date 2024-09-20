import React, { useState, useMemo } from 'react';

interface CreatePostProps {
  selectedFiles: File[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
}

// Medya görüntüleme bileşeni
const MediaViewer: React.FC<{ file: File; url: string }> = ({ file, url }) => (
  file.type.startsWith('image/') ? (
    <img src={url} className="max-w-full max-h-full object-contain" alt={file.name} />
  ) : (
    <video src={url} className="max-w-full max-h-full object-contain" controls />
  )
);

// Navigasyon düğmeleri bileşeni
const NavigationButtons: React.FC<{ onPrevious: () => void; onNext: () => void }> = ({ onPrevious, onNext }) => (
  <>
    <button
      type="button"
      onClick={onPrevious}
      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
    >
      Sol
    </button>
    <button
      type="button"
      onClick={onNext}
      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
    >
      Sağ
    </button>
  </>
);

const CreatePost: React.FC<CreatePostProps> = ({ selectedFiles, setTitle, title }) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : selectedFiles.length - 1));
  };

  const handleNext = () => {
    setCurrentFileIndex((prevIndex) => (prevIndex < selectedFiles.length - 1 ? prevIndex + 1 : 0));
  };

  const currentFile = selectedFiles[currentFileIndex];

  const fileUrl = useMemo(() => (currentFile ? URL.createObjectURL(currentFile) : ''), [currentFile]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="relative w-full h-96 mb-4">
        {selectedFiles.length > 0 && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <MediaViewer file={currentFile} url={fileUrl} />
            </div>
            {selectedFiles.length > 1 && (
              <NavigationButtons onPrevious={handlePrevious} onNext={handleNext} />
            )}
          </>
        )}
      </div>
      <input
        className="w-full border bg-gray-200 rounded-md p-2"
        type="text"
        name="title"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter post title"
      />
      <div className="mt-4 text-sm text-gray-500">
        {currentFileIndex + 1} / {selectedFiles.length}
      </div>
    </div>
  );
};

export default CreatePost;