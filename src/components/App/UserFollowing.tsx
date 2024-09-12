import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { GET_USER_FOLLOWING } from '../../graphql/queries/GetUserFollowing';
interface UserFollowingProps {
  userId: string;
}
interface Following {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhot?: string;
  isFollowing: boolean;
}
const UserFollowing: React.FC<UserFollowingProps> = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useQuery(GET_USER_FOLLOWING, {
    variables: { userId },
  });
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!data.getUserFollowing) {
    return <div>data is empty</div>;
  }
  const following = data.getUserFollowing as Following[];
  const filteredFollowing = following.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
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
        {filteredFollowing.map((user) => (
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

export default UserFollowing;
