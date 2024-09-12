import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { GET_USER_FOLLOWING } from '../../graphql/queries/GetUserFollowing';
import { GET_USER_FOLLOWERS } from '../../graphql/queries/GetUserFollowers';
interface UserFollowersProps {
  userId: string;
}
interface Followers {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhot?: string;
  isFollowing: boolean;
}
const UserFollowers: React.FC<UserFollowersProps> = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useQuery(GET_USER_FOLLOWERS, {
    variables: { userId },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!data.getUserFollowers) {
    return <div>data is empty</div>;
  }
  const followers = data.getUserFollowers as Followers[];
  const filteredFollowers = followers.filter(
    (following) =>
      following.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      following.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="p-4">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Ara"
          className="w-full border  p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {filteredFollowers.map((user) => (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src={user.profilePhot || 'https://via.placeholder.com/40'}
                alt={user.firstName}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <div>{user.firstName}</div>
                <div className="text-gray-400 text-sm">{user.lastName}</div>
              </div>
            </div>
            <button
              className={`${
                user.isFollowing ? 'bg-gray-500' : ' bg-blue-500'
              }  text-white px-4 py-1 rounded`}
            >
              {user.isFollowing ? 'Takiptesin' : 'Takip Et'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFollowers;
