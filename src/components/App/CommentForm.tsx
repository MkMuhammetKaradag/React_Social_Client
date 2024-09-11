import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CREATE_COMMENT } from '../../graphql/mutations/CreateComment';
import { AiOutlineSmile } from 'react-icons/ai';
const formSchema = z.object({
  comment: z.string().min(3, 'comment en az 3 karakter uzunluğunda olmalıdır'),
});
type CommentSchema = z.infer<typeof formSchema>;
interface CommentFormProps {
  postId: string;
}
const CommentForm: React.FC<CommentFormProps> = ({ postId }) => {
  const [createComment] = useMutation(CREATE_COMMENT);
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
          postId,
          content: data.comment,
        },
      },
    })
      .then((res) => {
        reset();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="mb-2 px-1">
      <form
        onSubmit={handleSubmit(handleComment)}
        className=" flex items-center border-t pt-2"
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
  );
};

export default CommentForm;
