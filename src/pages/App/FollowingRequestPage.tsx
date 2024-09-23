import { useMutation, useQuery } from '@apollo/client';

import { GET_FOLLOWING_REQUEST } from '../../graphql/queries/GetFollowingRequest';
import { GetFollowingRequest, User } from '../../utils/types';
import { FaRegTrashAlt } from 'react-icons/fa';

import { DELETE_FOLLOWING_REQUEST } from '../../graphql/mutations/DeleteFollowingRequest';
export const UserCard: React.FC<{ user: User }> = ({ user }) => (
  <div className="flex items-center justify-between">
    <div
      className="flex items-center hover:cursor-pointer"
      onClick={() => {
        // Navigate to user's profile
      }}
    >
      <img
        src={user.profilePhoto || 'https://via.placeholder.com/40'}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full mr-3"
      />
      <div>
        <div>{user.userName}</div>
        <div className="text-gray-400 text-sm">
          {user.firstName}-{user.lastName}
        </div>
      </div>
    </div>
  </div>
);
const FollowingRequestPage = () => {
  const [deleteFollowingRequest] = useMutation(DELETE_FOLLOWING_REQUEST, {
    refetchQueries: [
      {
        query: GET_FOLLOWING_REQUEST,
      },
    ],
    awaitRefetchQueries: true,
  });
  const { data, loading, error } = useQuery(GET_FOLLOWING_REQUEST);
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error</div>;
  }
  if (!data.getFollowingRequests) {
    return <>Not Found Data</>;
  }
  const requests = data.getFollowingRequests as GetFollowingRequest[];

  const deleteFollowingRequestHandle = (requestId: string) => {
    // Delete following request
    deleteFollowingRequest({
      variables: {
        requestId: requestId,
      },
    })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
    console.log('delete requst', 'sds');
  };
  return (
    <div className="w-1/2 h-full mt-10 p-3 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Following Requests</h1>
      </div>
      {requests.map((item, index) => (
        <div
          key={index}
          className="bg-gray-100 flex p-3 justify-between items-center "
        >
          <UserCard user={item.to}></UserCard>
          <div
            onClick={() => deleteFollowingRequestHandle(item._id)}
            className="flex hover:cursor-pointer"
          >
            <FaRegTrashAlt
              size={32}
              className=" hover:text-red-700 text-red-500 font-bold  rounded"
            ></FaRegTrashAlt>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FollowingRequestPage;
