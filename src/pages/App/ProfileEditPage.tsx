import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  FormError,
  InputField,
  SubmitButton,
} from '../../components/Auth/FormComponents';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../context/hooks';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '../../graphql/mutations/UpdateUserProfile';
import { setUpdateUser } from '../../context/slices/AuthSlice';
import { ProfileUploadImage } from './UserPage';

const formSchema = z.object({
  userName: z
    .string()
    .min(3, 'Geçerli bir e-posta adresi giriniz')
    .optional()
    .or(z.literal('')), // Boş stringi de kabul et,
  firstName: z
    .string()
    .min(2, 'Geçerli bir e-posta adresi giriniz')
    .optional()
    .or(z.literal('')), // Boş stringi de kabul et,
  lastName: z
    .string()
    .min(2, 'Şifre en az 8 karakter uzunluğunda olmalıdır')
    .optional()
    .or(z.literal('')), // Boş stringi de kabul et,
  isPrivate: z.boolean().optional(),
});
type ProfileEditSchema = z.infer<typeof formSchema>;
const ProfileEditPage = () => {
  const [profileEditError, setProfileEditError] = useState<string | null>(null);
  const user = useAppSelector((s) => s.auth.user);
  const [updateUserProfile, { loading }] = useMutation(UPDATE_USER_PROFILE);
  const dispatch = useAppDispatch();
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProfileEditSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user?.userName || '',
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      isPrivate: user?.isPrivate,
    },
  });

  const handleEditPage = async (data: ProfileEditSchema) => {
    setProfileEditError(null);
    try {
      const result = await updateUserProfile({
        variables: { input: data },
      });

      dispatch(setUpdateUser(result.data.updateUserProfile));
    } catch (error) {
      setProfileEditError(
        'user profiel  update  failed. Please check your information.'
      );
      console.error('user ypdate error:', error);
    }
  };
  const isFormValid =
    watch('firstName') !== user?.firstName ||
    watch('lastName') !== user?.lastName ||
    watch('userName') !== user?.userName ||
    watch('isPrivate') !== user?.isPrivate;
  return (
    <div className="w-2/4 ">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <div className="flex w-32 h-32 items-center justify-center">
        <ProfileUploadImage profilePhoto={user?.profilePhoto} />
      </div>

      <form onSubmit={handleSubmit(handleEditPage)} className="space-y-4 p-4">
        <InputField
          label="User Name"
          name="userName"
          type="text"
          placeholder={user?.userName || 'UserName'}
          register={register}
          error={errors.userName?.message}
        />
        <InputField
          label="First Name"
          name="firstName"
          type="text"
          placeholder={user?.firstName || 'FirstName'}
          register={register}
          error={errors.firstName?.message}
        />
        <InputField
          label="Last Name"
          name="lastName"
          type="text"
          placeholder={user?.lastName || 'lastName'}
          register={register}
          error={errors.lastName?.message}
        />

        <div className="flex bg-gray-100 rounded-md p-3  justify-between">
          <label>Hesap Gizli:</label>
          <Controller
            control={control}
            name="isPrivate"
            defaultValue={user?.isPrivate}
            render={({ field: { onChange, value } }) => (
              <button
                type="button"
                onClick={() => onChange(!value)} // Checkbox toggle işlevi
                className={`relative w-12 h-6 transition duration-200 ease-linear rounded-full ${
                  value ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <span
                  className={`absolute left-0 top-0 m-1 w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                    value ? 'translate-x-6' : 'translate-x-0'
                  }`}
                ></span>
              </button>
            )}
          />
          {errors.isPrivate && <p>{errors.isPrivate.message}</p>}
        </div>

        <FormError error={profileEditError}></FormError>

        <SubmitButton
          isValid={!!isFormValid}
          isSubmitting={isSubmitting}
          isLoading={false}
          label="Gönder"
        />
      </form>
    </div>
  );
};

export default ProfileEditPage;
