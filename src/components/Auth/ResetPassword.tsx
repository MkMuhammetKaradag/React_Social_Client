import React, { FC, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../../graphql/mutations/ResetPassword';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from '../../utils/styles';
import { FormError, PasswordField, SubmitButton } from './FormComponents';
type ResetPasswordProps = {
  token: string | null;
  setActiveState: (route: string) => void;
};

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8characters long!'),
    confirmPassword: z.string(),
  })
  .refine(
    (values) => {
      return values.password === values.confirmPassword;
    },
    {
      message: 'Password does not match',
      path: ['confirmPassword'],
    }
  );

type ResetPasswordSchema = z.infer<typeof formSchema>;
const ResetPassword: FC<ResetPasswordProps> = ({ setActiveState, token }) => {
  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);
  const [resetPasswordError, setResetPasswordError] = useState<string | null>(
    null
  );
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(formSchema),
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);
  const onSubmit = async (data: ResetPasswordSchema) => {
    setResetPasswordError(null);
    try {
      const response = await resetPassword({
        variables: {
          input: {
            token: token,
            password: data.password,
          },
        },
      });

      setActiveState('Login');
      navigate('/');
    } catch (error: any) {
      setResetPasswordError('resrt password error' + error.message);

      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
    }
  };

  const isFormValid = watch('password') && watch('confirmPassword');
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        reset your password
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <PasswordField
          label="Şifreniz"
          name="password"
          placeholder="********"
          register={register}
          error={errors.password?.message}
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />

        <PasswordField
          label="Şifrenizi Onaylayın"
          name="confirmPassword"
          placeholder="********"
          register={register}
          error={errors.confirmPassword?.message}
          showPassword={confirmPasswordShow}
          toggleShowPassword={() =>
            setConfirmPasswordShow(!confirmPasswordShow)
          }
        />
        <FormError error={resetPasswordError} />

        <SubmitButton
          isValid={!!isFormValid}
          isSubmitting={isSubmitting}
          isLoading={loading}
          label="Reset Password"
        />
        <br />
      </form>
    </div>
  );
};

export default ResetPassword;
