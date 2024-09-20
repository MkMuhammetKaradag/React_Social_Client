import React from 'react';
import { useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AiOutlineSmile } from 'react-icons/ai';
import { CREATE_COMMENT } from '../../graphql/mutations/CreateComment';

// Form şeması
const formSchema = z.object({
  comment: z.string().min(3, 'Yorum en az 3 karakter uzunluğunda olmalıdır'),
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
            postId,
            content: data.comment,
          },
        },
      });
      reset();
    } catch (err) {
      console.error('Yorum oluşturma hatası:', err);
    }
  };

  const commentLength = watch('comment')?.length ?? 0;
  const isCommentValid = commentLength >= 3;

  return (
    <div className="mb-2 px-1">
      <form
        onSubmit={handleSubmit(handleComment)}
        className="flex items-center border-t pt-2"
      >
        <AiOutlineSmile size={24} />
        <input
          {...register('comment')}
          type="text"
          placeholder="Yorum ekle..."
          className="ml-2 flex-grow text-sm outline-none"
        />
        <button
          disabled={!isCommentValid}
          className={`
            ${isCommentValid ? 'opacity-100' : 'opacity-0'}
            text-blue-500 font-semibold text-sm transition-opacity duration-500
          `}
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
