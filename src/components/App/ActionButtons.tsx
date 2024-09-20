import  { FC } from 'react';
import { AiOutlineHeart, AiOutlineComment, AiOutlineShareAlt, AiFillHeart } from 'react-icons/ai';
import { RiBookmarkLine } from 'react-icons/ri';

interface ActionButtonsProps {
  isLiked: boolean;
  toggleLike: () => void;
}

const ActionButtons: FC<ActionButtonsProps> = ({ isLiked, toggleLike }) => (
  <div className="flex justify-between items-center mb-2">
    <div className="flex space-x-4">
      <button onClick={toggleLike} className="transition-transform duration-300 ease-in-out transform">
        {isLiked ? (
          <AiFillHeart size={24} className="text-red-500 transform transition-transform duration-300 ease-in-out scale-125 hover:scale-110" />
        ) : (
          <AiOutlineHeart size={24} className="hover:text-gray-500 transform scale-100 hover:scale-110 transition-transform duration-300 ease-in-out" />
        )}
      </button>
      <button><AiOutlineComment size={24} /></button>
      <button><AiOutlineShareAlt size={24} /></button>
    </div>
    <button><RiBookmarkLine size={24} /></button>
  </div>
);

export default ActionButtons;