import React, { useState, useMemo } from 'react';

interface CreatePostProps {
  selectedFiles: File[];
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  title: string;
}

const CreatePost: React.FC<CreatePostProps> = ({
  selectedFiles,
  setTitle,
  title,
}) => {
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : selectedFiles.length - 1
    );
  };

  const handleNext = () => {
    setCurrentFileIndex((prevIndex) =>
      prevIndex < selectedFiles.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentFile = selectedFiles[currentFileIndex];

  // URL'yi sadece currentFile değiştiğinde yeniden oluşturuyoruz
  const fileUrl = useMemo(
    () => URL.createObjectURL(currentFile),
    [currentFile]
  );

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <div className="relative w-full h-96 mb-4">
        {selectedFiles.length > 0 && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              {currentFile.type.startsWith('image/') ? (
                <img
                  src={fileUrl} // Memoized URL
                  className="max-w-full max-h-full object-contain"
                  alt={currentFile.name}
                />
              ) : (
                <video
                  src={fileUrl} // Memoized URL
                  className="max-w-full max-h-full object-contain"
                  controls
                />
              )}
            </div>
            {selectedFiles.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  Sol
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
                >
                  Sağ
                </button>
              </>
            )}
          </>
        )}
      </div>
      <div className="w-full">
        <input
          className="w-full border bg-gray-200 rounded-md p-2"
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter post title"
        />
      </div>
      <div className="mt-4 text-sm text-gray-500">
        {currentFileIndex + 1} / {selectedFiles.length}
      </div>
    </div>
  );
};

export default CreatePost;
