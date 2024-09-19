import { useMutation, useQuery } from '@apollo/client';
import React, { useState } from 'react';
import { BiBookmark, BiCamera, BiFilm, BiSolidUser } from 'react-icons/bi';
import { GrGrid } from 'react-icons/gr';
import { GET_USER_PROFILE } from '../../graphql/queries/GetUserProfile';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../../context/hooks';
import UserPostsGrid from '../../components/App/UserPostsGrid';
import { FOLLOW_USER } from '../../graphql/mutations/FollowUser';
import { UN_FOLLOW_USER } from '../../graphql/mutations/UnFollowUser';
import { CREATE_CHAT } from '../../graphql/mutations/CreateChat';
import { GET_USER_CHATS } from '../../graphql/queries/GetUserChats';
import { GET_SIGNED_URL } from '../../graphql/mutations/getSignedUrl';
import axios from 'axios';
import { UPLOAD_PROFILEPHOTO } from '../../graphql/mutations/UploadProfilePhoto';

interface ProfileData {
  _id: string;
  chatId: string | null;
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
interface SignedUrlData {
  getSignedUploadUrl: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  };
}

interface SignUrlInput {
  publicId: string;
  folder: string;
}
const ProfileaUploadImage: React.FC<{ data: ProfileData }> = ({ data }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GET_SIGNED_URL
  );
  const [uploadProfilePhoto] = useMutation(UPLOAD_PROFILEPHOTO);

  const uploadToCloudinary = async (file: File) => {
    const publicId = `user_${Date.now()}`;
    const { data } = await getSignedUrl({
      variables: { input: { publicId, folder: 'profilePhotos' } },
    });

    if (!data) {
      throw new Error('Failed to get signed URL');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.getSignedUploadUrl.apiKey);
    formData.append('timestamp', data.getSignedUploadUrl.timestamp.toString());
    formData.append('signature', data.getSignedUploadUrl.signature);
    formData.append('public_id', publicId);
    formData.append('folder', 'profilePhotos');

    try {
      const response = await axios.post<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${data.getSignedUploadUrl.cloudName}/auto/upload`,
        formData
      );
      let transformedUrl = response.data.secure_url;
      // if (file.type.startsWith('image/')) {
      //   transformedUrl = transformedUrl.replace(
      //     '/upload/',
      //     '/upload/c_fill,w_128,h_128/'
      //   );
      // }
      return { url: transformedUrl, publicId };
    } catch (error) {
      throw new Error('sdsdsd');
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      const uploadimage = await uploadToCloudinary(file);

      uploadProfilePhoto({
        variables: {
          profilePhoto: uploadimage.url,
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <>
      {selectedImage ? (
        <img
          src={selectedImage}
          alt="Selected"
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <img
          src={data.profilePhoto || 'https://via.placeholder.com/120'}
          alt="Placeholder"
          className="w-full h-full rounded-full object-cover"
        />
      )}
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <button
        className="absolute"
        onClick={() => document.getElementById('imageInput')?.click()}
      >
        <BiCamera className="text-white" size={40}></BiCamera>
      </button>
    </>
  );
};

const ProfileHeader: React.FC<{ data: ProfileData }> = ({ data }) => {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const location = useLocation();
  console.log(data);
  return (
    <div className="flex items-center p-4">
      <div
        className={` ${
          user?._id == data._id ? 'relative bg-gray-400 opacity-60' : ''
        } rounded-full flex items-center w-32 h-32  justify-center `}
      >
        {user?._id === data._id ? (
          <ProfileaUploadImage data={data}></ProfileaUploadImage>
        ) : (
          <img
            src={data.profilePhoto || 'https://via.placeholder.com/120'}
            alt={data.firstName}
            className="w-32 h-32 rounded-full"
          />
        )}
      </div>

      <div className="flex flex-col  space-y-4 ml-20">
        {user?._id === data._id ? (
          <MyProfileActions
            userId={data._id}
            firstName={data.firstName}
          ></MyProfileActions>
        ) : (
          <ProfileActions
            userId={data._id}
            firstName={data.firstName}
            restricted={data.restricted}
            isFollowing={data.isFollowing}
            chatId={data.chatId}
          ></ProfileActions>
        )}

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
  chatId: string | null;
}> = ({ firstName, restricted, isFollowing, userId, chatId }) => {
  const user = useAppSelector((s) => s.auth.user);
  const navigate = useNavigate();
  const [followUser] = useMutation(FOLLOW_USER);
  const [unFollowUser] = useMutation(UN_FOLLOW_USER);
  const [createChat] = useMutation(CREATE_CHAT, {
    refetchQueries: [{ query: GET_USER_CHATS }],
    awaitRefetchQueries: true,
  });

  const followUserHandele = () => {
    followUser({
      variables: {
        targetUserId: userId,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const unFollowUserHandele = () => {
    unFollowUser({
      variables: {
        targetUserId: userId,
      },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const createChatHandele = () => {
    createChat({
      variables: {
        participantIds: [userId],
      },
    })
      .then(({ data }) => {
        navigate(`/direct/t/${data.createChat._id}`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getChatPage = () => {
    console.log('get chat page');
  };

  return (
    <div className="flex space-x-5  mb-4 items-center">
      <div>{firstName}</div>
      {userId != user?._id && (
        <>
          <button
            onClick={!isFollowing ? followUserHandele : unFollowUserHandele}
            className="flex bg-slate-100 text-black font-semibold py-1 px-2 rounded hover:bg-slate-200"
          >
            {isFollowing ? 'Takiptesin' : 'Takipet'}
          </button>

          <button
            onClick={chatId ? getChatPage : createChatHandele}
            className="flex bg-slate-100 text-black font-semibold py-1  px-2 rounded hover:bg-slate-200"
          >
            {chatId ? 'Mesaj Gönder' : 'chat oluştur'}
          </button>
        </>
      )}
    </div>
  );
};
const MyProfileActions: React.FC<{
  userId: string;
  firstName: string;
}> = ({ firstName, userId }) => {
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className="flex space-x-5  mb-4 items-center">
      <div>{firstName}</div>
      <button
        onClick={() => console.log('click')}
        className="flex bg-slate-100 text-black font-semibold py-1 px-2 rounded hover:bg-slate-200"
      >
        Profili Düzenle
      </button>

      <button
        onClick={() => console.log('click')}
        className="flex bg-slate-100 text-black font-semibold py-1  px-2 rounded hover:bg-slate-200"
      >
        Arşivigör
      </button>
    </div>
  );
};
const Stories: React.FC = () => (
  <div className="flex space-x-20 overflow-x-auto px-4 bg-red-300 ">
    stories
  </div>
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
        return profileData.restricted ? (
          <div>non post</div>
        ) : (
          <UserPostsGrid userId={profileData._id}></UserPostsGrid>
        );
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
