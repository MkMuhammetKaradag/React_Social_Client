import { useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { BiBookmark, BiCamera, BiFilm, BiSolidUser } from 'react-icons/bi';
import { GrGrid } from 'react-icons/gr';
import { GET_USER_PROFILE } from '../../graphql/queries/GetUserProfile';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../context/hooks';

interface ProfileData {
  _id: string;
  profilePhoto: string | null;
  firstName: string;
  lastName: string;
  createdAt: string | null;
  isPrivate: boolean;
  followersCount: number;
  followingCount: number;
  isFollowing: boolean;
  restricted: boolean;
}

// const profileData: ProfileData = {
//   username: 'enniyifiyat',
//   //   posts: 933,
//   followers: 26600,
//   following: 288,
//   bio: 'Reklam ve işbirliği için iletişime geç 📩\ntest linkimiz ⬇️',
//   profilePicture: '/api/placeholder/100/100',
//   stories: [
//     { name: 'Reels', image: '/api/placeholder/60/60' },
//     { name: 'Hepsiburadal...', image: '/api/placeholder/60/60' },
//     { name: 'Şokaktüel', image: '/api/placeholder/60/60' },
//     { name: 'Annebebeklink', image: '/api/placeholder/60/60' },
//     { name: 'Uşapolo', image: '/api/placeholder/60/60' },
//     { name: 'Elektronik Eşya', image: '/api/placeholder/60/60' },
//     { name: 'mutfak Link', image: '/api/placeholder/60/60' },
//   ],
//   posts: [
//     { image: '/api/placeholder/300/300' },
//     { image: '/api/placeholder/300/300' },
//     { image: '/api/placeholder/300/300' },
//     { image: '/api/placeholder/300/300' },
//     { image: '/api/placeholder/300/300' },
//     { image: '/api/placeholder/300/300' },
//   ],
// };

const ProfileHeader: React.FC<{ data: ProfileData }> = ({ data }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div className="flex items-center p-4">
      <img
        src={data.profilePhoto || 'https://via.placeholder.com/90'}
        alt={data.firstName}
        className="w-20 h-20 rounded-full"
      />
      <div className="flex flex-col  space-y-4 ml-20">
        <ProfileActions
          userId={data._id}
          firstName={data.firstName}
          restricted={data.restricted}
          isFollowing={data.isFollowing}
        ></ProfileActions>
        <div className="flex space-x-6">
          <div className="text-center flex space-x-1 items-center">
            <div className="font-bold">0</div>
            <div className="text-sm">gönderi</div>
          </div>
          <div
            className="text-center flex space-x-1 items-center cursor-pointer hover:text-gray-600"
            onClick={() =>
              navigate(`followers`, {
                state: {
                  backgroundLocation: location,
                },
              })
            }
          >
            <div className="font-bold">{data.followersCount}</div>
            <div className="text-sm">takipçi</div>
          </div>
          <div
            className="text-center flex space-x-1 items-center cursor-pointer hover:text-gray-600"
            onClick={() =>
              navigate(`following`, {
                state: {
                  backgroundLocation: location,
                },
              })
            }
          >
            <div className="font-bold">{data.followingCount}</div>
            <div className="text-sm">takip</div>
          </div>
        </div>

        <ProfileBio data={data}></ProfileBio>
      </div>
    </div>
  );
};

const ProfileBio: React.FC<{ data: ProfileData }> = ({ data }) => (
  <div className=" mb-4">
    <h1 className="font-bold">{data.firstName}</h1>
    <p className="whitespace-pre-line">
      {'Reklam ve işbirliği için iletişime geç 📩\ntest linkimiz ⬇️'}
    </p>
  </div>
);

const ProfileActions: React.FC<{
  userId: string;
  firstName: string;
  restricted: boolean;
  isFollowing: boolean;
}> = ({ firstName, restricted, isFollowing, userId }) => {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="flex space-x-5  mb-4 items-center">
      <div>{firstName}</div>
      {userId != user?._id && (
        <>
          <button className="flex bg-slate-100 text-black font-semibold py-1 px-2 rounded">
            {isFollowing ? 'Takiptesin' : 'Takipet'}
          </button>
          {!restricted && (
            <button className="flex bg-slate-100 text-black font-semibold py-1  px-2 rounded">
              Mesaj Gönder
            </button>
          )}
        </>
      )}
    </div>
  );
};

const Stories: React.FC = () => (
  <div className="flex space-x-20 overflow-x-auto px-4 bg-red-300 ">
    stories
  </div>
);

const PostGrid: React.FC = () => (
  <div className="grid grid-cols-3 gap-1">posts</div>
);

const TabBar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
}> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex  justify-center  space-x-3 border-t border-gray-300 py-2">
      <button
        className={`flex items-center space-x-1 py-3 ${
          activeTab === 'posts' ? 'border-t-2 text-blue-900 border-black' : ''
        }`}
        onClick={() => onTabChange('posts')}
      >
        <GrGrid size={16} /> <span>Gönderiler</span>
      </button>
      <button
        onClick={() => onTabChange('reels')}
        className={`flex items-center space-x-1 py-3 ${
          activeTab === 'reels' ? 'border-t-2 text-blue-900 border-black' : ''
        }`}
      >
        <BiCamera size={16} /> <span>REELS</span>
      </button>
    </div>
  );
};
const ReelsGrid: React.FC = () => (
  <div className="grid grid-cols-3 gap-1">
    {[1, 2, 3, 4, 5, 6].map((index) => (
      <div key={index} className="relative w-full h-48 bg-gray-200">
        <BiFilm
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          size={32}
        />
        <span className="absolute bottom-2 left-2 text-xs">Reel {index}</span>
      </div>
    ))}
  </div>
);

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [activeTab, setActiveTab] = useState('posts');
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId },
  });
  if (loading) return <div>Loading...</div>;
  if (!data.getUserProfile) {
    return <div>No user found</div>;
  }
  const profileData = data.getUserProfile as ProfileData;
  const renderContent = () => {
    switch (activeTab) {
      case 'posts':
        return profileData.restricted ? <div>non post</div> : <PostGrid />;
      case 'reels':
        return <ReelsGrid />;
      default:
        return null;
    }
  };
  return (
    <div className="max-w-4xl mx-auto bg-white">
      <ProfileHeader data={profileData} />

      <Stories />
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {renderContent()}
    </div>
  );
};

export default ProfilePage;
