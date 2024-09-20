import { useQuery } from '@apollo/client';
import React, { useState, useMemo } from 'react';
import { GET_USER_FOLLOWING } from '../../graphql/queries/GetUserFollowing';
import { UserWithFollowStatus } from '../../utils/types';

interface UserFollowingProps {
  userId: string;
}

const UserCard: React.FC<{ user: UserWithFollowStatus }> = ({ user }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <img
        src={user.profilePhoto || 'https://via.placeholder.com/40'}
        alt={`${user.firstName} ${user.lastName}`}
        className="w-10 h-10 rounded-full mr-3"
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

const UserFollowing: React.FC<UserFollowingProps> = ({ userId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data, loading, error } = useQuery(GET_USER_FOLLOWING, {
    variables: { userId },
  });

  const filteredFollowing = useMemo(() => {
    if (!data?.getUserFollowing) return [];
    return (data.getUserFollowing as UserWithFollowStatus[]).filter(
      (user) =>
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data?.getUserFollowing)
    return <div>Takip edilen kullanıcı bulunamadı.</div>;

  return (
    <div className="p-4">
      <div className="mb-4">
        <SearchInput value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="space-y-4">
        {filteredFollowing.map((user) => (
          <UserCard key={user._id} user={user} />
        ))}
      </div>
    </div>
  );
};

export default UserFollowing;
