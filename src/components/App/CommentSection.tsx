import  { FC } from 'react';
import { AiOutlineSmile } from 'react-icons/ai';
import { UseFormRegister, UseFormHandleSubmit, FieldErrors, UseFormWatch } from 'react-hook-form';

interface CommentSectionProps {
  register: UseFormRegister<{ comment: string }>;
  handleSubmit: UseFormHandleSubmit<{ comment: string }>;
  handleComment: (data: { comment: string }) => Promise<void>;
  errors: FieldErrors<{ comment: string }>;
  watch: UseFormWatch<{ comment: string }>;
}

const CommentSection: FC<CommentSectionProps> = ({ register, handleSubmit, handleComment, errors, watch }) => (
  <form onSubmit={handleSubmit(handleComment)} className="mt-2 flex items-center border-t pt-2">
    <AiOutlineSmile size={24} />
    <input
      {...register('comment')}
      type="text"
      placeholder="Add a comment..."
      className="ml-2 flex-grow text-sm outline-none"
    />
    <button
      disabled={watch('comment')?.length < 3}
      className={`${
        watch('comment')?.length < 3 ? 'opacity-0' : 'opacity-100'
      } text-blue-500 font-semibold text-sm transition-opacity duration-500`}
    >
      Post
    </button>
    {errors.comment?.message && (
      <p className="mt-1 text-sm text-red-500">{errors.comment.message}</p>
    )}
  </form>
);

export default CommentSection;