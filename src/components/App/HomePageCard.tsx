import  { FC, useState } from 'react';
import { useMutation } from '@apollo/client';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useLocation } from 'react-router-dom';
import { HomePageCardPost } from '../../utils/types';
import {
  ADD_LIKE_POST,
  REMOVE_LIKE_POST,
  CREATE_COMMENT,
} from '../../graphql/mutations';
import UserHeader from './UserHeader';
import MediaCarousel from './MediaCarousel';
import ActionButtons from './ActionButtons';
import CommentSection from './CommentSection';

interface HomePageCardProps {
  post: HomePageCardPost;
}

const formSchema = z.object({
  comment: z.string().min(3, 'Comment must be at least 3 characters long'),
});

type CommentSchema = z.infer<typeof formSchema>;

const HomePageCard: FC<HomePageCardProps> = ({ post }) => {
  const [isLiked, setIsLiked] = useState<boolean>(post.isLiked);
  const [likeCount, setLikeCount] = useState<number>(post.likeCount);
  const [commentCount, setCommentCount] = useState<number>(post.commentCount);

  const [addLike] = useMutation(ADD_LIKE_POST);
  const [removeLike] = useMutation(REMOVE_LIKE_POST);
  const [createComment] = useMutation(CREATE_COMMENT);

  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<CommentSchema>({
    resolver: zodResolver(formSchema),
  });

  const handleComment = async (data: CommentSchema) => {
    try {
      await createComment({
        variables: {
          input: {
            postId: post._id,
            content: data.comment,
          },
        },
      });
      setCommentCount((prev) => prev + 1);
      reset();
    } catch (err) {
      console.error('Comment creation error:', err);
    }
  };

  const toggleLike = async () => {
    try {
      if (isLiked) {
        await removeLike({ variables: { postId: post._id } });
        setLikeCount((prev) => prev - 1);
      } else {
        await addLike({ variables: { postId: post._id } });
        setLikeCount((prev) => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (err) {
      console.error('Like toggle error:', err);
    }
  };

  return (
    <div className="max-w-sm mt-2 mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <UserHeader user={post.user} />
      <MediaCarousel media={post.media} />
      <div className="p-4">
        <ActionButtons isLiked={isLiked} toggleLike={toggleLike} />
        <div className="text-sm">
          <span className="font-bold">{likeCount} likes</span>
        </div>
        <Link
          to={`/p/${post._id}`}
          state={{ backgroundLocation: location }}
          className="text-xs cursor-pointer text-gray-500 mt-2 block"
        >
          View all {commentCount} comments
        </Link>
        <CommentSection
          register={register}
          handleSubmit={handleSubmit}
          handleComment={handleComment}
          errors={errors}
          watch={watch}
        />
      </div>
    </div>
  );
};

export default HomePageCard;
