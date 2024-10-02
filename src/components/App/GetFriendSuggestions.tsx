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
    <div>
      <h1 className="mb-3">Friend Suggestions</h1>
      <div className="space-y-3">
        {friends.map((friend) => (
          <div key={friend._id} className="flex items-center hover:bg-gray-100">
            <img
              src={friend.profilePhoto || 'https://via.placeholder.com/40'}
              alt="User"
              className="w-10 h-10 rounded-full mr-2 object-cover"
            />
            <div>
              <Link to={`/user/${friend._id}`}>
                <p className={`font-bo`}>{friend.userName}</p>
              </Link>

              <p className={`text-s`}>
                {friend.firstName}-{friend.lastName}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetFriendSuggestions;
