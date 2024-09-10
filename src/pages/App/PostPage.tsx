import React from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { AiOutlineLeft, AiOutlineRight, AiOutlineClose } from 'react-icons/ai';

import { useAppSelector } from '../../context/hooks';
import { GET_POST } from '../../graphql/queries/GetPost';
import { useQuery } from '@apollo/client';
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
  const { postId } = useParams<{ postId: string }>();
  const { loading, error, data } = useQuery(GET_POST, {
    variables: { postId },
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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="absolute   top-0 right-0 justify-end p-4">
        <button onClick={handleClose} className="text-white  text-3xl">
          <AiOutlineClose />
        </button>
      </div>
      <div className="bg-white w-full max-w-4xl h-full max-h-[90vh] flex flex-col">
        <div className="flex-grow flex">
          <button
            onClick={goToPreviousPost}
            className={`text-black text-4xl ${
              postsIds.length == 0 && 'hidden'
            }`}
            disabled={currentPostIndex === 0}
          >
            <AiOutlineLeft />
          </button>
          <div className="flex-grow flex items-center justify-center">
            media- {postId}
          </div>
          <button
            onClick={goToNextPost}
            className={`text-black text-4xl ${
              postsIds.length == 0 && 'hidden'
            }`}
            disabled={currentPostIndex === postsIds.length - 1}
          >
            <AiOutlineRight />
          </button>
        </div>
        <div className="p-4">
          beğeni-yorum
          <p>Beğeni: {currentPost.likeCount}</p>
          <p>Yorum: {currentPost.commentCount}</p>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
