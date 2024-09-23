import { useQuery } from '@apollo/client';
import React, { useState, useMemo } from 'react';
import { GET_USER_FOLLOWERS } from '../../graphql/queries/GetUserFollowers';
import { UserWithFollowStatus } from '../../utils/types';

interface UserFollowersProps {
  userId: string;
}

const UserCard: React.FC<{ user: UserWithFollowStatus }> = ({ user }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <img
        src={user.profilePhoto || 'https://via.placeholder.com/40'}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full mr-3 object-cover"
      />
      <div>
        <div>{user.firstName}</div>
        <div className="text-gray-400 text-sm">{user.lastName}</div>
      </div>
    </div>
    <button
      className={`${
        user.isFollowing ? 'bg-gray-500' : 'bg-blue-500'
      } text-white px-4 py-1 rounded`}
    >
      {user.isFollowing ? 'Takiptesin' : 'Takip Et'}
    </button>
  </div>
);

const SearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <input
    type="text"
    placeholder="Ara"
    className="w-full border p-2 rounded"
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

const UserFollowers: React.FC<UserFollowersProps> = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useQuery(GET_USER_FOLLOWERS, {
    variables: { userId },
  });

  const filteredFollowers = useMemo(() => {
    if (!data?.getUserFollowers) return [];
    return (data.getUserFollowers as UserWithFollowStatus[]).filter(
      (follower) =>
        follower.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        follower.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.getUserFollowers) return <div>Takipçi bulunamadı.</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="space-y-4">
        {filteredFollowers.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserFollowers;
