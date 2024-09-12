import React, { useState } from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate, useParams } from 'react-router-dom';
import UserFollowing from '../../components/App/UserFollowing';
import UserFollowers from '../../components/App/UserFollowers';
const TabBar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex  justify-center  space-x-3 border-b border-gray-300 py-2">
      <div className="flex w-full justify-between border-gray-700 mb-4">
        <button
          className={`px-4 flex-1  py-2 ${
            activeTab === 'followers' ? 'border-b-2 border-gray-500' : ''
          }`}
          onClick={() => onTabChange('followers')}
        >
          Takipçiler
        </button>
        <button
          className={`px-4 flex-1 py-2 ${
            activeTab === 'following' ? 'border-b-2 border-gray-500' : ''
          }`}
          onClick={() => onTabChange('following')}
        >
          Takiptesin
        </button>
        <button
          className={`px-4 flex-1 py-2 ${
            activeTab === 'tags' ? 'border-b-2 border-gray-500' : ''
          }`}
          onClick={() => onTabChange('tags')}
        >
          Konu Etiketleri
        </button>
      </div>
    </div>
  );
};
const FollowersAndFollowingPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const { segment } = useParams<{ segment: string }>();

  const [activeTab, setActiveTab] = useState(segment || 'followers');
  const navigate = useNavigate();
  const handleClose = () => {
    navigate(-1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'followers':
        return <UserFollowers userId={userId || ''} />;
      case 'following':
        return <UserFollowing userId={userId || ''} />;
      default:
        return null;
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="absolute   top-0 right-0 justify-end p-4">
        <button onClick={handleClose} className="text-white  text-3xl">
          <AiOutlineClose />
        </button>
      </div>

      <div className="max-w-xl fixed w-full mx-auto h-[50vh] rounded-2xl bg-white">
        <div className="flex justify-center p-2 items-center mb-4">
          <h2 className="text-xl font-bold">Takipçiler</h2>
        </div>
        <button
          onClick={handleClose}
          className="text-3xl absolute top-1 right-2"
        >
          &times;
        </button>
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
        {renderContent()}
      </div>
    </div>
  );
};

export default FollowersAndFollowingPage;
