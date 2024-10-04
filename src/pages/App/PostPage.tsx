import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineClose } from 'react-icons/ai';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { useAppSelector } from '../../context/hooks';
import { GET_POST } from '../../graphql/queries/GetPost';
import { useQuery } from '@apollo/client';
import RenderMedia from '../../components/App/RenderMedia';
import PostRenderComments from '../../components/App/PostRenderComments';
import { PostPageCardPost } from '../../utils/types';

interface GetPostData {
  getPost: PostPageCardPost;
}

interface GetPostVars {
  postId: string;
}

// Components
const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="absolute top-0 right-0 z-50 justify-end ">
    <button
      onClick={onClick}
      className=" bg-black rounded-full text-gray-100 xl:bg-transparent xl:text-white text-3xl"
    >
      <AiOutlineClose />
    </button>
  </div>
);

const NavigationButton: React.FC<{
  onClick: () => void;
  direction: 'left' | 'right';
  isHidden: boolean;
}> = ({ onClick, direction, isHidden }) => (
  <button
    onClick={onClick}
    className={`${isHidden && 'invisible'}  ${
      direction === 'left' ? 'left-2' : 'right-2'
    } top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2`}
  >
    {direction === 'left' ? <BsChevronLeft /> : <BsChevronRight />}
  </button>
);

const PostContent: React.FC<{
  currentPost: PostPageCardPost;
  postId: string;
  currentMediaIndex: number;
  setCurrentMediaIndex: React.Dispatch<React.SetStateAction<number>>;
}> = ({ currentPost, postId, currentMediaIndex, setCurrentMediaIndex }) => (
  <div className="bg-white w-full max-w-6xl grid grid-cols-3 h-full md:max-h-[95vh] max-h-[80vh]">
    <div className="relative h-full  md:max-h-[95vh]   max-h-[80vh]  md:col-span-2 col-span-3 flex justify-center">
      <RenderMedia
        key={postId}
        media={currentPost.media}
        currentMediaIndex={currentMediaIndex}
        setCurrentMediaIndex={setCurrentMediaIndex}
      />
    </div>
    <div className="md:block hidden">
      <PostRenderComments
        isLiked={currentPost.isLiked}
        likeCount={currentPost.likeCount}
        postUser={currentPost.user}
        postId={postId}
      />
    </div>
  </div>
);

// Main Component
const PostPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  if (!postId) {
    return <div>Data is null</div>;
  }
  const { loading, error, data } = useQuery<GetPostData, GetPostVars>(
    GET_POST,
    {
      variables: { postId: postId },
    }
  );

  const postsIds =
    location.state?.backgroundLocation.pathname !== '/'
      ? useAppSelector((s) => s.explorePosts.posts)
      : [];

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
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
    if (currentPostIndex < postsIds.length - 1) {
      setCurrentMediaIndex(0);
      navigate(`/p/${postsIds[currentPostIndex + 1]}`, {
        state: { backgroundLocation: location.state?.backgroundLocation },
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.getPost || !postId) return <div>Data is null</div>;

  const currentPost = data.getPost;

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-between z-50">
      <CloseButton onClick={handleClose} />
      <NavigationButton
        onClick={goToPreviousPost}
        direction="left"
        isHidden={postsIds.length === 0 || currentPostIndex === 0}
      />
      <PostContent
        currentPost={currentPost}
        postId={postId}
        currentMediaIndex={currentMediaIndex}
        setCurrentMediaIndex={setCurrentMediaIndex}
      />

      <NavigationButton
        onClick={goToNextPost}
        direction="right"
        isHidden={
          postsIds.length === 0 || currentPostIndex === postsIds.length - 1
        }
      />
    </div>
  );
};

export default PostPage;
