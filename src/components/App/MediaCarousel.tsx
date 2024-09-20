import  { FC, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Media } from '../../utils/types';

interface MediaCarouselProps {
  media: Media[];
}

const MediaCarousel: FC<MediaCarouselProps> = ({ media }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState<number>(0);
  const [mediaError, setMediaError] = useState<boolean>(false);

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
    setMediaError(false);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
    setMediaError(false);
  };

  const handleMediaError = () => setMediaError(true);

  const renderMedia = (mediaItem: Media) => {
    if (mediaError) {
      return (
        <img
          className="w-full h-[500px] object-cover"
          src="https://via.placeholder.com/400x500?text=Media+Not+Found"
          alt="Backup Media"
        />
      );
    }

    const mediaUrl = `https://res.cloudinary.com/doarbqecd/${mediaItem.type.toLowerCase()}/upload/c_fill,w_400,h_500/v1725363937/posts/${
      mediaItem.publicId
    }`;

    return mediaItem.type === 'IMAGE' ? (
      <img
        className="w-full h-[500px] object-cover"
        src={mediaUrl}
        alt="Post content"
        onError={handleMediaError}
      />
    ) : (
      <video
        className="w-full h-[500px] object-cover"
        controls
        src={mediaUrl}
        onError={handleMediaError}
      />
    );
  };

  return (
    <div className="relative">
      {renderMedia(media[currentMediaIndex])}
      {media.length > 1 && (
        <>
          <button
            onClick={prevMedia}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
          >
            <BsChevronLeft />
          </button>
          <button
            onClick={nextMedia}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2"
          >
            <BsChevronRight />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {media.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentMediaIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaCarousel;
