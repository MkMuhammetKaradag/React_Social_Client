// pages/Login.tsx

import React, { useState, FC } from 'react';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useAppDispatch } from '../../context/hooks';
import { setUser } from '../../context/slices/AuthSlice';
import { LOGIN_USER } from '../../graphql/mutations/Login';
import {
  InputField,
  PasswordField,
  SubmitButton,
  FormError,
} from './FormComponents';

type LoginProps = {
  setActiveState: (route: string) => void;
};

const formSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
  password: z.string().min(8, 'Şifre en az 8 karakter uzunluğunda olmalıdır'),
});

type LoginSchema = z.infer<typeof formSchema>;

const Login: FC<LoginProps> = ({ setActiveState }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<LoginSchema>({
    resolver: zodResolver(formSchema),
  });

  const [login, { loading }] = useMutation(LOGIN_USER);

  const handleLogin = async (data: LoginSchema) => {
    setLoginError(null);
    try {
      const result = await login({
        variables: { input: data },
      });
      window.location.reload();
      dispatch(setUser(result.data.loginUser.user));
      reset();
    } catch (error) {
      setLoginError('Login failed. Please check your information.');
      console.error('Login error:', error);
    }
  };

  const isFormValid = watch('email') && watch('password');

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Giriş</h2>
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
        <InputField
          label="E-posta Adresiniz"
          name="email"
          type="email"
          placeholder="ornek@email.com"
          register={register}
          error={errors.email?.message}
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

        <FormError error={loginError} />

        <SubmitButton
          isValid={!!isFormValid}
          isSubmitting={isSubmitting}
          isLoading={loading}
          label="Giriş Yap"
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

export default Login;
