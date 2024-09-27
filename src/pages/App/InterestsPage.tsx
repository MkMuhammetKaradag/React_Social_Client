import { useState, useMemo } from 'react';
import TagInput from '../../components/App/TagInput';
import { useAppDispatch, useAppSelector } from '../../context/hooks';
import { useMutation } from '@apollo/client';
import { CHANGE_USER_INTERESTS } from '../../graphql/mutations/ChangeUserInterests';
import { setUserInterests } from '../../context/slices/AuthSlice';

const InterestsPage = () => {
  const user = useAppSelector((s) => s.auth.user);
  const [tags, setTags] = useState<string[]>(user?.interests || []);
  const dispatch = useAppDispatch();

  const [changeUserInterests] = useMutation(CHANGE_USER_INTERESTS);

  // Kontrol et: tags ile user.interests arasında fark var mı?
  const isChanged = useMemo(() => {
    if (!user?.interests) return tags.length > 0;
    if (tags.length !== user.interests.length) return true;
    return tags.some((tag, index) => tag !== user.interests[index]);
  }, [tags, user?.interests]);

  const changeInterestsHandle = () => {
    changeUserInterests({
      variables: {
        input: {
          interests: tags,
        },
      },
      onCompleted(data) {
        if (data.changeUserInterests) {
          dispatch(setUserInterests(tags));
        }
      },
    });
  };

  return (
    <div className="w-1/2 flex flex-col justify-start pt-20 h-full p-4 ">
      <h1 className="text-2xl font-bold mb-4">Interests</h1>
      <TagInput setTags={setTags} tags={tags}></TagInput>
      <button
        className={` ${isChanged ? 'bg-red-500' : 'bg-gray-400'} p-3 mt-5`}
        onClick={changeInterestsHandle}
        disabled={!isChanged}
      >
        Gönder
      </button>
    </div>
  );
};

export default InterestsPage;
