import { useMutation, useQuery } from '@apollo/client';
import { GET_FOLLOW_REQUEST } from '../../graphql/queries/GetFollowRequest';
import { GetFollowRequest } from '../../utils/types';
import { UserCard } from './FollowingRequestPage';
import { ACCEPT_FOLLOW_REQUEST } from '../../graphql/mutations/AcceptFollowRequest';
import { REJECT_FOLLOW_REQUEST } from '../../graphql/mutations/RejecttFollowRequest';

// We create a custom hook to handle follow requests
const useFollowRequests = () => {
  // Query hook to get tracking requests
  const { data, loading, error } = useQuery<{
    getFollowRequests: GetFollowRequest[];
  }>(GET_FOLLOW_REQUEST);

  // Mutation hooks for accepting and rejecting requests
  const [acceptRequest] = useMutation(ACCEPT_FOLLOW_REQUEST, {
    refetchQueries: [{ query: GET_FOLLOW_REQUEST }],
    awaitRefetchQueries: true,
  });
  const [rejectRequest] = useMutation(REJECT_FOLLOW_REQUEST, {
    refetchQueries: [{ query: GET_FOLLOW_REQUEST }],
    awaitRefetchQueries: true,
  });

  //Request acceptance function
  const handleAccept = async (requestId: string): Promise<void> => {
    try {
      await acceptRequest({ variables: { requestId } });
      console.log('İstek kabul edildi');
    } catch (err) {
      console.error('İstek kabul edilirken hata oluştu:', err);
    }
  };

  //Request rejection function
  const handleReject = async (requestId: string): Promise<void> => {
    try {
      await rejectRequest({ variables: { requestId } });
      console.log('İstek reddedildi');
    } catch (err) {
      console.error('İstek reddedilirken hata oluştu:', err);
    }
  };

  return {
    requests: data?.getFollowRequests || [],
    loading,
    error,
    handleAccept,
    handleReject,
  };
};

// Main component
const FollowRequestPage: React.FC = () => {
  const { requests, loading, error, handleAccept, handleReject } =
    useFollowRequests();

  // Check loading status
  if (loading) return <div>Yükleniyor...</div>;

  // Error status check
  if (error) return <div>Hata oluştu: {error.message}</div>;

  // Show message if no data
  if (requests.length === 0) return <div>Takip isteği bulunamadı</div>;

  return (
    <div className="w-1/2 h-full mt-10 p-3 space-y-4">
      <h1 className="text-2xl font-bold">Takip İstekleri</h1>
      {requests.map((item) => (
        <RequestItem
          key={item._id}
          request={item}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      ))}
    </div>
  );
};

// Prop types for the RequestItem component
interface RequestItemProps {
  request: GetFollowRequest;
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

// Single request element component
const RequestItem: React.FC<RequestItemProps> = ({
  request,
  onAccept,
  onReject,
}) => (
  <div className="bg-gray-100 flex p-3 justify-between items-center">
    <UserCard user={request.from} />
    <div className="flex space-x-2">
      <button
        onClick={() => onAccept(request._id)}
        className="bg-green-500 p-2 rounded-md text-white hover:bg-green-700"
      >
        Kabul Et
      </button>
      <button
        onClick={() => onReject(request._id)}
        className="bg-red-500 p-2 rounded-md text-white hover:bg-red-700"
      >
        Reddet
      </button>
    </div>
  </div>
);

export default FollowRequestPage;
