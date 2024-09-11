import React, { useEffect, useState } from 'react';
import { BiHeart, BiSend } from 'react-icons/bi';
import { FiMessageCircle } from 'react-icons/fi';
import { LuBookMarked } from 'react-icons/lu';
import CommentForm from './CommentForm';
import { useQuery } from '@apollo/client';
import { GET_POST_COMMENTS } from '../../graphql/queries/GetPostComments';
import { CREATE_COMMENT_SUBSCRIPTION } from '../../graphql/subscriptions/CreateComment';
import { PostUser } from '../../pages/App/HomePage';
import {
  AiFillHeart,
  AiOutlineComment,
  AiOutlineHeart,
  AiOutlineShareAlt,
} from 'react-icons/ai';
import { RiBookmarkLine } from 'react-icons/ri';
interface PostRenderCommentsProps {
  postId: string;
  isLiked: boolean;
  postUser: PostUser;
  likeCount: number;
}

interface Comment {
  _id: string;
  content: string;
  user: PostUser;
}
const PostRenderComments: React.FC<PostRenderCommentsProps> = ({
  postId,
  postUser,
  likeCount,
  isLiked,
}) => {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [extraPassValue, setExtraPassValue] = useState(0);
  const pageSize = 10;
  const {
    data: dataComments,
    loading: loadingComments,
    error: errorComments,
    fetchMore,
    subscribeToMore,
  } = useQuery(GET_POST_COMMENTS, {
    variables: {
      input: {
        postId,
        page: 1,
        pageSize,
        extraPassValue: 0,
      },
    },
  });

  useEffect(() => {
    // Yeni ürünler eklendiğinde listeyi güncellemek için subscribeToMore'u kullanın
    const unsubscribe = subscribeToMore({
      document: CREATE_COMMENT_SUBSCRIPTION,
      variables: {
        postId: postId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const newComment = subscriptionData.data.createCommentPost;
        setExtraPassValue((prev) => prev + 1);
        return {
          ...prev,
          getPostComments: {
            ...prev.getPostComments,
            comments: [newComment, ...prev.getPostComments.comments],
            totalCount: prev.getPostComments.totalCount + 1,
          },
        };
      },
      onError: (err) => {
        console.log(err);
      },
    });

    return () => unsubscribe();
  }, [subscribeToMore]);

  const loadMore = () => {
    if (!hasMore) return;
    fetchMore({
      variables: {
        input: {
          postId,
          page: page + 1,
          pageSize: pageSize,
          extraPassValue: extraPassValue,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getPostComments.comments.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        setHasMore(
          fetchMoreResult.getPostComments.comments.length === pageSize
        );
        return {
          getPostComments: {
            ...prev.getPostComments,
            comments: [
              ...prev.getPostComments.comments,
              ...fetchMoreResult.getPostComments.comments,
            ],
          },
        };
      },
    });
  };
  const addLikePost = () => {
    console.log('liked');

    // addLike({
    //   variables: {
    //     postId: post._id,
    //   },
    // })
    //   .then((res) => {
    //     setLikeCount((prev) => prev + 1);
    //     setIsLiked(true);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };
  const removeLikePost = () => {
    console.log('unliked');
    // removeLike({
    //   variables: {
    //     postId: post._id,
    //   },
    // })
    //   .then((res) => {
    //     setLikeCount((prev) => prev - 1);
    //     setIsLiked(false);
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });
  };
  if (loadingComments && page === 1) return <p>Loading...</p>;
  if (errorComments) return <p>Hata oluştu: {errorComments.message}</p>;

  if (!dataComments.getPostComments.comments) return <p>Veri bulunamadı</p>;

  const comments = dataComments.getPostComments.comments as Comment[];
  const totalCount = dataComments.getPostComments.totalCount as number;

  return (
    <div className="md:col-span-1 col-span-3 max-h-[95vh] h-full  flex flex-col">
      <div className="flex-shrink-0 flex justify-between  ">
        {/* Header - Fixed at top */}
        <div className="w-full bg-white border-b p-4 z-10">
          <div className="flex items-center">
            <img
              src={postUser.profilePhoto || 'sdsd'}
              alt="User"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">
              {postUser.firstName + ' ' + postUser.lastName}
            </span>
            {/* <span className="ml-2 text-blue-500">• Takip Et</span> */}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto ">
        {/* Comments */}
        <div className="bg-white p-4">
          {comments.map((comment, i) => (
            <div key={comment._id} className="mb-3">
              <span className="font-semibold mr-2">
                user{comment.user.firstName}
              </span>
              <span>This is a sample comment {comment.content}</span>
            </div>
          ))}
          <div
            onClick={loadMore}
            className={`${
              totalCount <= comments.length && 'hidden'
            } hover:bg-gray-100  text-center items-center justify-center p-3`}
          >
            +
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 px-1 flex justify-between mb-4">
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
      <div className="flex-shrink-0 ">
        <CommentForm postId={postId}></CommentForm>
      </div>
    </div>
  );
};

export default PostRenderComments;
