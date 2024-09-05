import React, { FC, useState } from 'react';
import styles from '../../utils/styles';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError, InputField, SubmitButton } from './FormComponents';
import { FORGOT_PASSWORD } from '../../graphql/mutations/ForgotPassword';
import { useMutation } from '@apollo/client';

type ForgotPasswordProps = {
  setActiveState: (route: string) => void;
};
const formSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordSchema = z.infer<typeof formSchema>;
const ForgotPassword: FC<ForgotPasswordProps> = ({ setActiveState }) => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(formSchema),
  });
  const [forgotPasswordError, setforgotPasswordError] = useState<string | null>(
    null
  );
  const onSubmit = async (data: ForgotPasswordSchema) => {
    setforgotPasswordError(null);
    try {
      await forgotPassword({
        variables: {
          input: {
            email: data.email,
          },
        },
      });
      console.log('Please check your email to reset your password!');
      reset();
    } catch (error: any) {
      setforgotPasswordError(
        'password reset failed failed. Please check your information.'
      );
      console.log('GraphQL Errors:', error.graphQLErrors[0].message);
    }
  };
  const isFormValid = watch('email');
  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Şifremi Unuttum</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="E-posta Adresiniz"
          name="email"
          type="email"
          placeholder="ornek@email.com"
          register={register}
          error={errors.email?.message}
        />

        <FormError error={forgotPasswordError} />
        <SubmitButton
          isValid={!!isFormValid}
          isSubmitting={isSubmitting}
          isLoading={false}
          label="şifremi unuttum"
        />
      </form>
    </div>
  );
};

export default ForgotPassword;
