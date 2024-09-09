import { useMutation, useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Logout';
import { useAppDispatch } from '../../context/hooks';
import { logout } from '../../context/slices/AuthSlice';
import { GET_HOMA_PAGE_POSTS } from '../../graphql/queries/GetPostsFromFollowedUsers';
import HomePageCard from '../../components/App/HomePageCard';

interface PostUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

export interface Post {
  _id: string;
  user: PostUser;
  media: {
    url: string;
    type: string;
    publicId: string;
  }[];
  commentCount: number;
  likeCount: number;
  title: string;
}
const HomePage = () => {
  const [logoutUser] = useMutation(LOGOUT_USER);
  const dispatch = useAppDispatch();
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };

  const { data, loading, error } = useQuery(GET_HOMA_PAGE_POSTS, {
    variables: {
      input: {
        page: 1, // Sayfa numarası, ihtiyaca göre değiştirilebilir
        pageSize: 10, // Sayfa boyutu, ihtiyaca göre değiştirilebilir
      },
    },
  });

  // Veriler yüklendiğinde konsola yazdır
  useEffect(() => {
    if (data && data.getPostsFromFollowedUsers) {
      console.log(
        'Takip Edilen Kullanıcıların Postları:',
        data.getPostsFromFollowedUsers
      );
    }
  }, [data]);

  // Hata veya yükleme durumu
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  // Eğer veriler render edilmek istenirse

  return (
    <div className="grid md:grid-cols-4  sm:grid-cols-3">
      <div className="col-span-3 justify-center">
        <div className="bg-red-50">Home Page</div>
        <div className=" ">
          {/* <HomePageCard></HomePageCard> */}
          {data.getPostsFromFollowedUsers.map((post: Post) => (
            // <div key={post._id} className=" bg-yellow-100 flex">
            //   <h2 className="text-lg font-bold mb-2">{post.title}</h2>
            //   <p className="mb-2">{`${post.user.firstName} ${post.user.lastName}`}</p>
            //   <p className="mb-2">Comments: {post.commentCount}</p>
            //   <p className="mb-4">Likes: {post.likeCount}</p>
            //   <div className="media">
            //     {post.media.map(
            //       (mediaItem: { url: string; type: string }, index: number) => (
            //         <div key={index} className="media-item mb-4">
            //           {mediaItem.type === 'IMAGE' ? (
            //             <img
            //               src={mediaItem.url}
            //               alt="Post Media"
            //               className="max-w-full h-auto rounded"
            //             />
            //           ) : mediaItem.type === 'video' ? (
            //             <video controls className="max-w-full h-auto rounded">
            //               <source src={mediaItem.url} type="video/mp4" />
            //               Your browser does not support the video tag.
            //             </video>
            //           ) : null}
            //         </div>
            //       )
            //     )}
            //   </div>
            // </div>
            <HomePageCard key={post._id} post={post}></HomePageCard>
          ))}
        </div>
      </div>
      <div
        onClick={handleLogout}
        className="col-span-1     md:block   hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        <span className=" font-semibold text-sm">Log out</span>
      </div>
    </div>
  );
};

export default HomePage;
