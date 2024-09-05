import React from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import styles from '../../utils/styles';
import { UseFormRegister } from 'react-hook-form';

interface InputFieldProps {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  name, 
  type, 
  placeholder, 
  register, 
  error 
}) => (
  <div>
    <label htmlFor={name} className={styles.label}>{label}</label>
    <input
      {...register(name)}
      type={type}
      id={name}
      placeholder={placeholder}
      className={`${styles.input} ${error ? 'border-red-500' : ''}`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

interface PasswordFieldProps {
  label: string;
  name: string;
  placeholder: string;
  register: UseFormRegister<any>;
  error?: string;
  showPassword: boolean;
  toggleShowPassword: () => void;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({ 
  label, 
  name, 
  placeholder, 
  register, 
  error,
  showPassword,
  toggleShowPassword
}) => (
  <div className="relative">
    <label htmlFor={name} className={styles.label}>{label}</label>
    <input
      {...register(name)}
      type={showPassword ? 'text' : 'password'}
      id={name}
      placeholder={placeholder}
      className={`${styles.input} ${error ? 'border-red-500' : ''}`}
    />
    <button
      type="button"
      onClick={toggleShowPassword}
      className="absolute right-3 top-9 text-gray-400"
      aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
    >
      {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
    </button>
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

interface SubmitButtonProps {
  isValid: boolean;
  isSubmitting: boolean;
  isLoading: boolean;
  label: string;
}

export const SubmitButton: React.FC<SubmitButtonProps> = ({ 
  isValid, 
  isSubmitting, 
  isLoading, 
  label 
}) => (
  <button
    type="submit"
    disabled={!isValid || isSubmitting || isLoading}
    className={`w-full py-2 px-4 rounded-md text-white font-semibold transition-colors ${
      isValid && !isSubmitting && !isLoading
        ? 'bg-[#F02C56] hover:bg-[#d42648]'
        : 'bg-gray-300 cursor-not-allowed'
    }`}
  >
    {isSubmitting || isLoading ? 'İşlem yapılıyor...' : label}
  </button>
);

export const FormError: React.FC<{ error: string | null }> = ({ error }) => (
  error ? <p className="text-sm text-red-500 text-center">{error}</p> : null
);