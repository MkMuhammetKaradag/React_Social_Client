import { useEffect, useCallback, useRef, useState } from 'react';
import { useMutation, gql } from '@apollo/client';

const UPDATE_USER_STATUS = gql`
  mutation UpdateUserStatus($status: String!) {
    updateUserStatus(status: $status)
  }
`;

type UserStatus = 'online' | 'offline';

interface UpdateUserStatusMutationVariables {
  status: UserStatus;
}

export const useStatusUpdater = (interval: number = 60000) => {
  const [updateUserStatusMutation] = useMutation<
    { updateUserStatus: boolean },
    UpdateUserStatusMutationVariables
  >(UPDATE_USER_STATUS);

  const [currentStatus, setCurrentStatus] = useState<UserStatus>('offline'); // Durum state'i
  const isMounted = useRef(false); // Mount durumunu izlemek için useRef

  const updateStatus = useCallback(
    async (status: UserStatus) => {
      // Eğer durum değişmediyse güncellemeyi atla
      if (currentStatus === status) return;

      try {
        await updateUserStatusMutation({ variables: { status } });
        setCurrentStatus(status); // Durumu güncelle
      } catch (error) {
        console.error('Error updating user status:', error);
      }
    },
    [updateUserStatusMutation, currentStatus] // currentStatus'u bağımlılık olarak ekleyin
  );

  useEffect(() => {
    if (!isMounted.current) {
      // İlk mount'ta status'u online yapın
      updateStatus('online');
      isMounted.current = true;
    }

    const intervalId = setInterval(() => updateStatus('online'), interval);

    const handleBeforeUnload = () => {
      updateStatus('offline');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      // Component unmount olduğunda offline yap
      updateStatus('offline');
    };
  }, [updateStatus, interval]);
};
