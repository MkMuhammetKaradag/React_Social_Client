import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from 'react-icons/ai';

import { useAppSelector } from '../../context/hooks';
import { GET_POST } from '../../graphql/queries/GetPost';
import { useQuery } from '@apollo/client';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import RenderMedia from '../../components/App/RenderMedia';
import { BiHeart, BiSend } from 'react-icons/bi';
import { FiMessageCircle } from 'react-icons/fi';
import { LuBookMarked } from 'react-icons/lu';
import PostRenderComments from '../../components/App/PostRenderComments';
interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto: string;
}

export interface Media {
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
  isLiked: boolean;
  likeCount: number;
  user: User;
  media: Media[];
}
const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const { loading, error, data } = useQuery(GET_POST, {
    variables: { postId },
  });
  const navigate = useNavigate();
  const location = useLocation();

  const postsIds =
    location.state?.backgroundLocation.pathname != '/'
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
      setCurrentMediaIndex(0);
      navigate(`/p/${postsIds[currentPostIndex - 1]}`, {
        state: { backgroundLocation: location.state?.backgroundLocation },
      });
    }
  };

  const goToNextPost = () => {
    setCurrentMediaIndex(0);
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
  if (!data.getPost || !postId) {
    return <div>data is nul</div>;
  }

  const currentPost = data.getPost as Post;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="absolute   top-0 right-0 justify-end p-4">
        <button onClick={handleClose} className="text-white  text-3xl">
          <AiOutlineClose />
        </button>
      </div>
      <div className="bg-white w-full max-w-6xl grid  grid-cols-3  h-full  md:max-h-[95vh]  ">
        <div className="relative h-full max-h-[95vh]   md:col-span-2  col-span-3  flex  justify-center">
          <RenderMedia
            key={postId}
            media={currentPost.media}
            currentMediaIndex={currentMediaIndex}
            setCurrentMediaIndex={setCurrentMediaIndex}
          />
        </div>
        <PostRenderComments
          isLiked={currentPost.isLiked}
          likeCount={currentPost.likeCount}
          postUser={currentPost.user}
          postId={postId}
        ></PostRenderComments>
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
