import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import axios from 'axios';

import ImageDropzone from './ImageDropzone';
import CreatePostForm from './CreatePost';
import { GET_SIGNED_URL, CREATE_POST } from '../../graphql/mutations';
import { Media } from '../../utils/types';
// Modal Props interface
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Interface for signed URL input and response
interface SignUrlInput {
  publicId: string;
  folder: string;
}

interface SignedUrlData {
  getSignedUploadUrl: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  };
}

// CreatePost input and response interface
interface CreatePostInput {
  title: string;
  media: Media[];
}

interface CreatePostData {
  createPost: {
    title: string;
    media: Media[];
  };
}

// Modal bileşeni için prop tipleri
interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Cloudinary'ye dosya yükleme işlevi
const uploadToCloudinary = async (file: File, getSignedUrl: any) => {
  const publicId = `post_${Date.now()}`;
  const { data } = await getSignedUrl({
    variables: { input: { publicId, folder: 'posts' } },
  });

  if (!data) throw new Error('Failed to get signed URL');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', data.getSignedUploadUrl.apiKey);
  formData.append('timestamp', data.getSignedUploadUrl.timestamp.toString());
  formData.append('signature', data.getSignedUploadUrl.signature);
  formData.append('public_id', publicId);
  formData.append('folder', 'posts');

  try {
    const response = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${data.getSignedUploadUrl.cloudName}/auto/upload`,
      formData
    );
    let transformedUrl = response.data.secure_url;
    if (file.type.startsWith('image/')) {
      transformedUrl = transformedUrl.replace(
        '/upload/',
        '/upload/c_fill,w_300,h_300/'
      );
    }
    return { url: transformedUrl, publicId };
  } catch (error) {
    throw new Error('Upload failed');
  }
};

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');

  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GET_SIGNED_URL
  );
  const [createPost] = useMutation<CreatePostData, { input: CreatePostInput }>(
    CREATE_POST
  );

  if (!isOpen) return null;

  // Gönderi paylaşma işlevi
  const sharePost = async () => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const uploadedImage = await uploadToCloudinary(file, getSignedUrl);
      return {
        url: uploadedImage.url,
        publicId: uploadedImage.publicId,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
      } as Media;
    });

    const uploadedMedia = await Promise.all(uploadPromises);
    try {
      const result = await createPost({
        variables: {
          input: { title, media: uploadedMedia },
        },
      });
      console.log('Post created:', result.data?.createPost);
      // Formu sıfırla veya yeni gönderiye yönlendir
      onClose();
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  // Modal dışına tıklandığında kapatma işlevi
  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Adımlar arası geçiş işlevleri
  const handleNextStep = () => setStep(step + 1);
  const handleBackStep = () => {
    if (step === 2) {
      setSelectedFiles([]);
      setTitle('');
    }
    setStep(step - 1);
  };

  // Mevcut adıma göre içerik render etme
  const renderStep = () => {
    switch (step) {
      case 1:
        return <ImageDropzone onFilesSelected={setSelectedFiles} />;
      case 2:
        return (
          <CreatePostForm
            selectedFiles={selectedFiles}
            setTitle={setTitle}
            title={title}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={handleOutsideClick}
    >
      <div
        className="bg-white rounded-lg p-6 w-full max-w-3xl h-full max-h-[80%] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          step={step}
          selectedFilesCount={selectedFiles.length}
          title={title}
          onNext={handleNextStep}
          onBack={handleBackStep}
          onShare={sharePost}
        />
        <div className="flex-grow overflow-auto">{renderStep()}</div>
      </div>
    </div>
  );
};

// Modal başlığı bileşeni
const ModalHeader: React.FC<{
  step: number;
  selectedFilesCount: number;
  title: string;
  onNext: () => void;
  onBack: () => void;
  onShare: () => void;
}> = ({ step, selectedFilesCount, title, onNext, onBack, onShare }) => (
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-xl font-bold">Gönderi Oluştur</h2>
    {selectedFilesCount > 0 && step < 2 && (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onNext}
      >
        İleri
      </button>
    )}
    {step > 1 && (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onBack}
      >
        Geri
      </button>
    )}
    {step > 1 && title.length > 3 && selectedFilesCount > 0 && (
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={onShare}
      >
        Paylaş
      </button>
    )}
  </div>
);

export default CreatePostModal;
