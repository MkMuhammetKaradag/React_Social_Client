import { useQuery } from '@apollo/client';

import { GET_FRIEND_SUGGESTIONS } from '../../graphql/queries/GetFriendSuggestions';
import { User } from '../../utils/types';
import { Link } from 'react-router-dom';

const GetFriendSuggestions = () => {
  const { data, error, loading } = useQuery(GET_FRIEND_SUGGESTIONS);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;
  if (!data.getFriendSuggestions) return <p>data is empty</p>;

  const friends = data.getFriendSuggestions as User[];

  return (
    <div className="border-b rounded-md shadow-md border-gray-300 p-2 ">
      <h1 className="mb-3">FRIEND SUGGESTIONS</h1>
      <div className="space-y-3 ">
        {friends.map((friend) => (
          <Link
            to={`/user/${friend._id}`}
            key={friend._id}
            className="flex p-3 rounded-t-md  items-center hover:bg-gray-100"
          >
            <img
              src={friend.profilePhoto || 'https://via.placeholder.com/40'}
              alt="User"
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
            <div>
              <p className={`font-bo`}>{friend.userName}</p>

              <p className={`text-s`}>
                {friend.firstName}-{friend.lastName}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default GetFriendSuggestions;
