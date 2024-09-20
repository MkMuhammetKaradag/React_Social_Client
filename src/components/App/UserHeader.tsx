import  { FC } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineMore } from 'react-icons/ai';
import { User } from '../../utils/types'; 

interface UserHeaderProps {
  user: User;
}

const UserHeader: FC<UserHeaderProps> = ({ user }) => (
  <div className="p-4 flex items-center justify-between">
    <div className="flex items-center">
      <img
        className="w-10 h-10 rounded-full object-cover"
        src={user.profilePhoto || 'https://via.placeholder.com/40'}
        alt="Profile"
      />
      <Link to={`user/${user._id}`} className="ml-3">
        <span className="text-sm font-semibold">
          {`${user.firstName} ${user.lastName}`}
        </span>
      </Link>
    </div>
    <button className="text-gray-500">
      <AiOutlineMore size={24} />
    </button>
  </div>
);

export default UserHeader;
