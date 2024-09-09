import React, { FC, useState } from 'react';
import {
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineSmile,
  AiOutlineMore,
} from 'react-icons/ai';
import { RiBookmarkLine } from 'react-icons/ri';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Post } from '../../pages/App/HomePage';

type HomePageCardProps = {
  post: Post;
};

const HomePageCard: FC<HomePageCardProps> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === post.media.length - 1 ? 0 : prevIndex + 1
    );
    setMediaError(false); // Yeni medyaya geçildiğinde hata durumunu sıfırla
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? post.media.length - 1 : prevIndex - 1
    );
    setMediaError(false); // Yeni medyaya geçildiğinde hata durumunu sıfırla
  };

  const handleMediaError = () => {
    setMediaError(true);
  };

  const renderMedia = (media: Post['media'][0]) => {
    if (mediaError) {
      return (
        <img
          className="w-full h-[500px] object-cover"
          src="https://via.placeholder.com/400x500?text=Media+Not+Found"
          alt="Yedek Medya"
        />
      );
    }

    if (media.type === 'IMAGE') {
      return (
        <img
          className="w-full h-[500px] object-cover"
          src={`https://res.cloudinary.com/doarbqecd/image/upload/c_fill,w_400,h_500/v1725363937/posts/${media.publicId}`}
          alt="Post content"
          onError={handleMediaError}
        />
      );
    } else if (media.type === 'VIDEO') {
      return (
        <video
          className="w-full  h-[500px] object-cover"
          controls
          src={`https://res.cloudinary.com/doarbqecd/video/upload/c_fill,w_400,h_500/v1725363937/posts/${media.publicId}`}
          onError={handleMediaError}
        />
      );
    }

    return null;
  };

  return (
    <div className="max-w-sm mt-2 mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full"
            src={post.user.profilePhoto || 'https://via.placeholder.com/40'}
            alt="Profile"
          />
          <div className="ml-3">
            <span className="text-sm font-semibold">
              {post.user.firstName + ' ' + post.user.lastName}
            </span>
          </div>
          <button className="ml-auto text-gray-500">
            <AiOutlineMore size={24} />
          </button>
        </div>
      </div>
      <div className="relative">
        {renderMedia(post.media[currentMediaIndex])}
        {post.media.length > 1 && (
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
              {post.media.map((_, index) => (
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
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <button>
              <AiOutlineHeart size={24} />
            </button>
            <button>
              <AiOutlineComment size={24} />
            </button>
            <button>
              <AiOutlineShareAlt size={24} />
            </button>
          </div>
          <button>
            <RiBookmarkLine size={24} />
          </button>
        </div>
        <div className="text-sm">
          <span className="font-bold">{post.likeCount} beğenme</span>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          {post.commentCount} yorumun tümünü gör
        </div>
        <div className="mt-2 flex items-center border-t pt-2">
          <AiOutlineSmile size={24} />
          <input
            type="text"
            placeholder="Yorum ekle..."
            className="ml-2 flex-grow text-sm outline-none"
          />
          <button className="text-blue-500 font-semibold text-sm">
            Paylaş
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePageCard;
