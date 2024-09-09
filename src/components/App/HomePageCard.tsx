import React, { FC, useState } from 'react';
import {
  AiOutlineHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineSmile,
  AiOutlineMore,
  AiFillHeart,
} from 'react-icons/ai';
import { RiBookmarkLine } from 'react-icons/ri';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { Post } from '../../pages/App/HomePage';
import { useMutation } from '@apollo/client';
import { ADD_LIKE_POST } from '../../graphql/mutations/AddLikePost';
import { REMOVE_LIKE_POST } from '../../graphql/mutations/RemoveLikePost';

type HomePageCardProps = {
  post: Post;
};

const HomePageCard: FC<HomePageCardProps> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [addLike] = useMutation(ADD_LIKE_POST);
  const [removeLike] = useMutation(REMOVE_LIKE_POST);
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

  const addLikePost = () => {
    console.log('liked');

    addLike({
      variables: {
        postId: post._id,
      },
    })
      .then((res) => {
        setLikeCount((prev) => prev + 1);
        setIsLiked(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };
  const removeLikePost = () => {
    console.log('unliked');
    removeLike({
      variables: {
        postId: post._id,
      },
    })
      .then((res) => {
        setLikeCount((prev) => prev - 1);
        setIsLiked(false);
      })
      .catch((e) => {
        console.log(e);
      });
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
            <button
              onClick={!isLiked ? addLikePost : removeLikePost}
              className="transition-transform duration-300 ease-in-out transform"
            >
              {!isLiked ? (
                <AiOutlineHeart
                  size={24}
                  className=" hover:text-gray-500 transform scale-100 hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              ) : (
                <AiFillHeart
                  size={24}
                  className="text-red-500 transform transition-transform duration-300 ease-in-out scale-125 hover:scale-110"
                />
              )}
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
          <span className="font-bold">{likeCount} beğenme</span>
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
