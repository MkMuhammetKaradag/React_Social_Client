// pages/Register.tsx

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { REGISTER_USER } from '../../graphql/mutations/Register';
import {
  InputField,
  PasswordField,
  SubmitButton,
  FormError,
} from './FormComponents';

type RegisterProps = {
  setActiveState: (route: string) => void;
};

const formSchema = z
  .object({
    email: z.string().email('Geçerli bir e-posta adresi giriniz'),
    firstName: z.string().min(2, 'Ad en az 2 karakter uzunluğunda olmalıdır'),
    userName: z
      .string()
      .min(3, 'userName en az 2 karakter uzunluğunda olmalıdır')
      .max(20, 'max 20 karakter'),
    lastName: z.string().min(2, 'Soyad en az 2 karakter uzunluğunda olmalıdır'),

    password: z.string().min(8, 'Şifre en az 8 karakter uzunluğunda olmalıdır'),
    confirmPassword: z
      .string()
      .min(8, 'Şifre en az 8 karakter uzunluğunda olmalıdır'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Şifreler eşleşmiyor!',
  });

type RegisterSchema = z.infer<typeof formSchema>;

const Register: React.FC<RegisterProps> = ({ setActiveState }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [registerError, setRegisterError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(formSchema),
  });

  const [userRegister, { loading }] = useMutation(REGISTER_USER);

  const handleRegister = async (data: RegisterSchema) => {
    setRegisterError(null);
    const { confirmPassword, ...restData } = data;
    try {
      const res = await userRegister({
        variables: {
          input: restData,
        },
      });

      if (res.data.registerUser.activationToken) {
        localStorage.setItem(
          'activationToken',
          res.data.registerUser.activationToken
        );
        reset();
        setActiveState('Verification');
      }
    } catch (error) {
      console.error('Kayıt hatası:', error);
      setRegisterError(
        'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      );
    }
  };

  const isFormValid =
    watch('email') &&
    watch('firstName') &&
    watch('lastName') &&
    watch('password') &&
    watch('confirmPassword');

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Kayıt Ol</h2>
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
        <InputField
          label="E-posta Adresiniz"
          name="email"
          type="email"
          placeholder="ornek@email.com"
          register={register}
          error={errors.email?.message}
        />
        <div className="flex">
          <InputField
            label="Adınız"
            name="firstName"
            type="text"
            placeholder="Adınız"
            register={register}
            error={errors.firstName?.message}
          />

          <InputField
            label="Soyadınız"
            name="lastName"
            type="text"
            placeholder="Soyadınız"
            register={register}
            error={errors.lastName?.message}
          />
        </div>
        <InputField
          label="Kullanıcı adınız "
          name="userName"
          type="text"
          placeholder="Kullanıcı Adınız"
          register={register}
          error={errors.userName?.message}
        />
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
          showPassword={showPassword}
          toggleShowPassword={() => setShowPassword(!showPassword)}
        />

        <FormError error={registerError} />

        <SubmitButton
          isValid={!!isFormValid}
          isSubmitting={isSubmitting}
          isLoading={loading}
          label="Kayıt Ol"
        />
      </form>

      <p className="mt-4 text-center">
        <button
          onClick={() => setActiveState('Forgot-Password')}
          className="text-[#F02C56] hover:underline"
        >
          Şifrenizi mi unuttunuz?
        </button>
      </p>
    </div>
  );
};

export default Register;
