// src/components/CreatePost.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useMutation } from '@apollo/client';
import axios from 'axios';
import { CREATE_POST } from '../graphql/mutations/createPost';
import { GET_SIGNED_URL } from '../graphql/mutations/getSignedUrl';
// Types
interface Media {
  url: string;
  publicId: string;
  type: 'IMAGE' | 'VIDEO';
}

interface SignedUrlData {
  getSignedUploadUrl: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  };
}

interface CreatePostData {
  createPost: {
    title: string;
    media: Media[];
  };
}

interface SignUrlInput {
  publicId: string;
}

interface CreatePostInput {
  title: string;

  media: Media[];
}

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [media, setMedia] = useState<Media[]>([]);
  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GET_SIGNED_URL
  );
  const [createPost, { loading, error }] = useMutation<
    CreatePostData,
    { input: CreatePostInput }
  >(CREATE_POST);
  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => reject('Error loading video file');
      video.src = URL.createObjectURL(file);
    });
  };
  const uploadToCloudinary = async (file: File) => {
    // Video dosyası kontrolü
    if (file.type.startsWith('video/')) {
      try {
        const duration = await getVideoDuration(file);
        if (duration > 60) {
          // 60 saniye = 1 dakika
          throw new Error('Video must be 1 minute or shorter');
        }
      } catch (error) {
        console.error('Error checking video duration:', error);
        throw error;
      }
    }

    const publicId = `post_${Date.now()}`;
    const { data } = await getSignedUrl({
      variables: { input: { publicId } },
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
    // Medya türüne göre dönüşüm
    // if (file.type.startsWith('image/')) {
    //   formData.append('transformation', 'c_fill,w_300,h_300');
    // }
    //else if (file.type.startsWith('video/')) {
    //   formData.append('transformation', 'c_fill,w_300,h_300,f_mp4');
    // }
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
      console.log(error);
      throw new Error('sdsdsd');
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uploadPromises = files.map(async (file) => {
      const uploadimage = await uploadToCloudinary(file);
      return {
        url: uploadimage.url,
        publicId: uploadimage.publicId,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
      } as Media;
    });

    const uploadedMedia = await Promise.all(uploadPromises);
    setMedia([...media, ...uploadedMedia]);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await createPost({
        variables: {
          input: {
            title,
            media,
          },
        },
      });
      console.log('Post created:', result.data?.createPost);

      // Reset form or navigate to the new post
    } catch (err) {
      console.error('Error creating post:', err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={title}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setTitle(e.target.value)
        }
        placeholder="Post title"
        required
      />
      <input type="file" multiple onChange={handleFileChange} />
      {media.map((item, index) => (
        <div key={index}>
          {item.type === 'IMAGE' ? (
            <img src={item.url} alt="Preview" style={{ maxWidth: '200px' }} />
          ) : (
            <video src={item.url} style={{ maxWidth: '200px' }} controls />
          )}
          {/* <input
            type="text"
            value={item.caption}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
              const newMedia = [...media];
              newMedia[index].caption = e.target.value;
              setMedia(newMedia);
            }}
            placeholder="Caption"
          /> */}
        </div>
      ))}
      <button type="submit">Create Post</button>
    </form>
  );
};

export default CreatePost;
