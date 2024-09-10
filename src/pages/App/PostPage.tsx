import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from 'react-icons/ai';

import { useAppSelector } from '../../context/hooks';
import { GET_POST } from '../../graphql/queries/GetPost';
import { useQuery } from '@apollo/client';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
interface User {
  _id: string;
  firstName: string;
  profilePhoto: string;
}

interface Media {
  url: string;
  publicId: string;
  type: string;
}

interface Post {
  _id: string;
  title: string;
  tags: string[];
  createdAt: string;
  commentCount: number;
  likeCount: number;
  user: User;
  media: Media[];
}
const PostPage: React.FC = () => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const { postId } = useParams<{ postId: string }>();
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { postId },
    onCompleted: () => {
      setMediaError(false);
    },
  });
  const navigate = useNavigate();
  const location = useLocation();
  const postsIds =
    location.state?.backgroundLocation.pathname == '/explore'
      ? useAppSelector((s) => s.explorePosts.posts)
      : [];
  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    if (backgroundLocation) {
      navigate(backgroundLocation.pathname || '/', { replace: true });
    } else {
      navigate('/');
    }
  };

  const currentPostIndex = postsIds.findIndex((id) => id === postId);

  const goToPreviousPost = () => {
    if (currentPostIndex > 0) {
      navigate(`/p/${postsIds[currentPostIndex - 1]}`, {
        state: { backgroundLocation: location.state?.backgroundLocation },
      });
    }
  };

  const goToNextPost = () => {
    if (currentPostIndex < postsIds.length - 1) {
      navigate(`/p/${postsIds[currentPostIndex + 1]}`, {
        state: { backgroundLocation: location.state?.backgroundLocation },
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }
  if (!data.getPost) {
    return <div>data is nul</div>;
  }

  const currentPost = data.getPost as Post;

  const nextMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === currentPost.media.length - 1 ? 0 : prevIndex + 1
    );
    setMediaError(false); // Yeni medyaya geçildiğinde hata durumunu sıfırla
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prevIndex) =>
      prevIndex === 0 ? currentPost.media.length - 1 : prevIndex - 1
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
          className=" h-full object-contain "
          src={`https://res.cloudinary.com/doarbqecd/image/upload/v1725363937/posts/${media.publicId}`}
          alt="Post content"
          onError={handleMediaError}
        />
      );
    } else if (media.type === 'VIDEO') {
      return (
        <video
          className=" h-full object-contain "
          controls
          src={`https://res.cloudinary.com/doarbqecd/video/upload/v1725363937/posts/${media.publicId}`}
          onError={handleMediaError}
        />
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="absolute   top-0 right-0 justify-end p-4">
        <button onClick={handleClose} className="text-white  text-3xl">
          <AiOutlineClose />
        </button>
      </div>
      <div className="bg-white w-full max-w-6xl grid  grid-cols-3  h-full  md:max-h-[95vh]  ">
        <div className="relative h-full max-h-[95vh]   md:col-span-2  col-span-3  flex  justify-center">
          {renderMedia(currentPost.media[currentMediaIndex])}
          {currentPost.media.length > 1 && (
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
                {currentPost.media.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentMediaIndex
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="md:col-span-1 col-span-3 max-h-[95vh] h-full bg-slate-100 flex flex-col">
          <div className="flex-shrink-0 bg-slate-300">a</div>
          <div className="flex-grow  bg-red-300">b</div>
          <div className="flex-shrink-0 bg-yellow-200">c</div>
          <div className="flex-shrink-0 bg-green-300">d</div>
        </div>
      </div>

      <button
        onClick={goToPreviousPost}
        className={`${
          (postsIds.length == 0 || currentPostIndex == 0) && 'hidden'
        } absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2`}
      >
        <BsChevronLeft />
      </button>
      <button
        onClick={goToNextPost}
        className={`${
          (postsIds.length == 0 || currentPostIndex == postsIds.length - 1) &&
          'hidden'
        } absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2`}
      >
        <BsChevronRight />
      </button>
    </div>
  );
};

export default PostPage;
