import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

interface PreviewFile extends File {
  preview: string;
}

const MAX_FILES = 3;
const MAX_VIDEO_DURATION = 120; // 2 dakika (saniye cinsinden)

interface ImageDropzoneProps {
  onFilesSelected: (files: File[]) => void;
}

const ImageDropzone: React.FC<ImageDropzoneProps> = ({ onFilesSelected }) => {
  const [files, setFiles] = useState<PreviewFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => reject('Video dosyası yüklenirken hata oluştu');
      video.src = URL.createObjectURL(file);
    });
  };

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setError(null);

      if (files.length + acceptedFiles.length > MAX_FILES) {
        setError(`En fazla ${MAX_FILES} dosya yükleyebilirsiniz.`);
        return;
      }

      const validFiles: PreviewFile[] = [];

      for (const file of acceptedFiles) {
        if (file.type.startsWith('video/')) {
          try {
            const duration = await getVideoDuration(file);
            if (duration > MAX_VIDEO_DURATION) {
              setError(
                `"${file.name}" 2 dakikadan uzun. Lütfen daha kısa bir video seçin.`
              );
              continue;
            }
          } catch (err) {
            console.error(err);
            setError('Video süresi kontrol edilirken bir hata oluştu.');
            continue;
          }
        }

        validFiles.push(
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        );
      }

      const newFiles = [...files, ...validFiles];
      setFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [files, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [], 'video/*': [] },
    multiple: true,
    onDrop,
    maxFiles: MAX_FILES,
  });

  const removeFile = (file: PreviewFile) => {
    setFiles((files) => files.filter((f) => f !== file));
    URL.revokeObjectURL(file.preview);
    setError(null);
  };

  const thumbs = files.map((file) => (
    <div
      key={file.name}
      className="relative inline-flex rounded-sm border border-gray-300 mb-2 mr-2 w-24 h-24 p-1 box-border group"
    >
      <div className="flex min-w-0 overflow-hidden">
        {file.type.startsWith('image/') ? (
          <img
            src={file.preview}
            className="block w-auto h-full"
            onLoad={() => {
              URL.revokeObjectURL(file.preview);
            }}
            alt={file.name}
          />
        ) : (
          <video
            src={file.preview}
            className="block w-auto h-full"
            onLoadedMetadata={() => {
              URL.revokeObjectURL(file.preview);
            }}
          />
        )}
      </div>
      <button
        onClick={() => removeFile(file)}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        &times;
      </button>
    </div>
  ));

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed w-full h-64 border-gray-300 rounded-lg p-8 text-center cursor-pointer ${
          isDragActive ? 'border-blue-500' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex justify-center mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
        {isDragActive ? (
          <p className="text-blue-500">Dosyayı bırakın</p>
        ) : (
          <p>Bir dosya sürükleyin veya buraya tıklayın</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          (En fazla {MAX_FILES} dosya yükleyebilirsiniz. Videolar en fazla 2
          dakika uzunluğunda olmalıdır.)
        </p>
      </div>
      {error && <p className="text-red-500 mt-2">{error}</p>}
      {files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-lg font-semibold mb-2">Önizlemeler:</h4>
          <div className="flex flex-wrap">{thumbs}</div>
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
