import React, { useState } from 'react';
import ImageDropzone from './ImageDropzone';
import CreatePost from './CreatePost';
import { useMutation } from '@apollo/client';
import { GET_SIGNED_URL } from '../../graphql/mutations/getSignedUrl';
import { CREATE_POST } from '../../graphql/mutations/createPost';
import axios from 'axios';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}
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
interface Media {
  url: string;
  publicId: string;
  type: 'IMAGE' | 'VIDEO';
}
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
const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [title, setTitle] = useState<string>('');
  const [media, setMedia] = useState<Media[]>([]);

  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GET_SIGNED_URL
  );
  const [createPost] = useMutation<CreatePostData, { input: CreatePostInput }>(
    CREATE_POST
  );
  if (!isOpen) return null;
  const uploadToCloudinary = async (file: File) => {
    const publicId = `post_${Date.now()}`;
    const { data } = await getSignedUrl({
      variables: { input: { publicId, folder: 'posts' } },
    });

    if (!data) {
      throw new Error('Failed to get signed URL');
    }

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
      throw new Error('sdsdsd');
    }
  };

  const sharePost = async () => {
    const uploadPromises = selectedFiles.map(async (file) => {
      const uploadimage = await uploadToCloudinary(file);
      return {
        url: uploadimage.url,
        publicId: uploadimage.publicId,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
      } as Media;
    });

    const uploadedMedia = await Promise.all(uploadPromises);
    try {
      const result = await createPost({
        variables: {
          input: {
            title,
            media: uploadedMedia,
          },
        },
      });
      console.log('Post created:', result.data?.createPost);

      // Reset form or navigate to the new post
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handleBackStep = () => {
    if (step === 2) {
      setSelectedFiles([]);
      setTitle('');
    }
    setStep(step - 1);
  };
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <ImageDropzone onFilesSelected={(files) => setSelectedFiles(files)} />
        );
      case 2:
        return (
          <CreatePost
            selectedFiles={selectedFiles}
            setTitle={setTitle}
            title={title}
          ></CreatePost>
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
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Gönderi Oluştur</h2>
          {selectedFiles.length > 0 && step < 2 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleNextStep}
            >
              İleri
            </button>
          )}
          {step > 1 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleBackStep}
            >
              Geri
            </button>
          )}
          {step > 1 && title.length > 3 && selectedFiles.length > 0 && (
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={sharePost}
            >
              paylaş
            </button>
          )}
        </div>
        <div className="flex-grow overflow-auto">{renderStep()}</div>
      </div>
    </div>
  );
};

export default CreatePostModal;
