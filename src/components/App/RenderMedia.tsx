import React, { useEffect, useState } from 'react';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Media } from '../../pages/App/PostPage';

interface RenderMediaProps {
  media: Media[];
  currentMediaIndex: number;
  setCurrentMediaIndex: React.Dispatch<React.SetStateAction<number>>;
}
const RenderMedia: React.FC<RenderMediaProps> = ({
  media,
  currentMediaIndex,
  setCurrentMediaIndex,
}) => {
  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === media.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? media.length - 1 : prevIndex - 1
    );
  };

  const renderMedia = (media: Media) => {
    if (media.type === 'IMAGE') {
      return (
        <img
          className=" h-full object-contain "
          src={`https://res.cloudinary.com/doarbqecd/image/upload/v1725363937/posts/${media.publicId}`}
          alt="Post content"
        />
      );
    } else if (media.type === 'VIDEO') {
      return (
        <video
          className=" h-full object-contain "
          controls
          src={`https://res.cloudinary.com/doarbqecd/video/upload/v1725363937/posts/${media.publicId}`}
        />
      );
    }
  };
  return (
    <>
      {renderMedia(media[media.length > 1 ? currentMediaIndex : 0])}
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
    </>
  );
};

export default RenderMedia;
