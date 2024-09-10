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
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CREATE_COMMENT } from '../../graphql/mutations/CreateComment';
import { Link, useLocation } from 'react-router-dom';

type HomePageCardProps = {
  post: Post;
};
const formSchema = z.object({
  comment: z.string().min(3, 'comment en az 3 karakter uzunluğunda olmalıdır'),
});
type CommentSchema = z.infer<typeof formSchema>;
const HomePageCard: FC<HomePageCardProps> = ({ post }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [mediaError, setMediaError] = useState(false);
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [addLike] = useMutation(ADD_LIKE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);
  const [removeLike] = useMutation(REMOVE_LIKE_POST);
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CommentSchema>({
    resolver: zodResolver(formSchema),
  });

  const handleComment = async (data: CommentSchema) => {
    await createComment({
      variables: {
        input: {
          postId: post._id,
          content: data.comment,
        },
      },
    })
      .then((res) => {
        setCommentCount((prev) => prev + 1);
        reset();
      })
      .catch((err) => {
        console.log(err);
      });
  };

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
        <div
          onClick={() => {
            console.log('get post id', post._id);
          }}
          className="text-xs cursor-pointer text-gray-500 mt-2"
        >
          <Link to={`/p/${post._id}`} state={{ backgroundLocation: location }}>
            {commentCount} yorumun tümünü gör
          </Link>
        </div>
        <form
          onSubmit={handleSubmit(handleComment)}
          className="mt-2 flex items-center border-t pt-2"
        >
          <AiOutlineSmile size={24} />
          <input
            {...register('comment')}
            type="text"
            placeholder="Yorum ekle..."
            className="ml-2 flex-grow text-sm outline-none"
          />
          <button
            disabled={watch('comment')?.length < 3}
            className={`${
              watch('comment')?.length < 3 ? 'opacity-0' : 'opacity-100'
            } text-blue-500 font-semibold text-sm transition-opacity duration-500`}
          >
            Paylaş
          </button>
        </form>
        {errors.comment?.message && (
          <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
        )}
      </div>
    </div>
  );
};

export default HomePageCard;
