import React, { useState, useEffect, useRef } from 'react';
import { Media } from '../../utils/types';

const DEFAULT_IMAGE_URL =
  'https://media.istockphoto.com/id/1354776457/vector/default-image-icon-vector-missing-picture-page-for-website-design-or-mobile-app-no-photo.jpg?s=612x612&w=0&k=20&c=w3OW0wX3LyiFRuDHo9A32Q0IUMtD4yjXEvQlqyYk9O4=';

const MediaItem: React.FC<{ media: Media; rowSpan: boolean }> = ({
  media,
  rowSpan,
}) => {
  const [src, setSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState(false);
  const mediaRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const baseUrl = 'https://res.cloudinary.com/doarbqecd/';
          const transformation = `c_fill,w_300,h_${rowSpan ? '600' : '300'}`;

          if (media.type === 'VIDEO') {
            // Video için thumbnail oluştur
            setSrc(
              `${baseUrl}video/upload/${transformation}/v1725363937/posts/${media.publicId}.jpg`
            );
          } else {
            setSrc(
              `${baseUrl}image/upload/${transformation}/v1725363937/posts/${media.publicId}`
            );
          }

          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (mediaRef.current) {
      observer.observe(mediaRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [media, rowSpan]);

  const handleError = () => {
    // console.error(`Failed to load media: ${media.publicId}`);
    setSrc(DEFAULT_IMAGE_URL);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <>
      {!isLoaded && <div className="w-full h-full bg-gray-200 animate-pulse" />}
      <img
        ref={mediaRef}
        src={src}
        alt={media.type === 'VIDEO' ? 'Video thumbnail' : 'Image'}
        className={`w-full h-full object-cover ${
          isLoaded ? 'block' : 'hidden'
        }`}
        onError={handleError}
        onLoad={handleLoad}
      />
      {media.type === 'VIDEO' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M4 4l12 6-12 6z" />
          </svg>
        </div>
      )}
    </>
  );
};

export default MediaItem;
