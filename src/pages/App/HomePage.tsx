import { useMutation, useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Logout';
import { useAppDispatch } from '../../context/hooks';
import { logout } from '../../context/slices/AuthSlice';
import { GET_HOMA_PAGE_POSTS } from '../../graphql/queries/GetPostsFromFollowedUsers';
import HomePageCard from '../../components/App/HomePageCard';
import InfiniteScroll from 'react-infinite-scroll-component';

export interface PostUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePhoto?: string;
}

export interface Post {
  _id: string;
  isLiked: boolean;
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
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageSize = 2;

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
    } catch (err) {
      console.log(err);
    }
  };

  const { data, loading, error, fetchMore } = useQuery(GET_HOMA_PAGE_POSTS, {
    variables: {
      input: {
        page: 1,
        pageSize: pageSize,
      },
    },
    onCompleted: (data) => {
      if (data.getPostsFromFollowedUsers.length === 0) setHasMore(false);
      if (data.getPostsFromFollowedUsers.length < pageSize) setHasMore(false);
    },
  });

  const loadMore = () => {
    if (!hasMore) return;
    fetchMore({
      variables: {
        input: {
          page: page + 1,
          pageSize: pageSize,
        },
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getPostsFromFollowedUsers.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        setHasMore(
          fetchMoreResult.getPostsFromFollowedUsers.length === pageSize
        );
        return {
          getPostsFromFollowedUsers: [
            ...prev.getPostsFromFollowedUsers,
            ...fetchMoreResult.getPostsFromFollowedUsers,
          ],
        };
      },
    });
  };

  if (loading && page === 1) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data?.getPostsFromFollowedUsers);
  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3">
      <div className="col-span-3 justify-center">
        <div className="bg-red-50">Home Page</div>
        <InfiniteScroll
          dataLength={data?.getPostsFromFollowedUsers.length || 0}
          next={loadMore}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {data?.getPostsFromFollowedUsers.map((post: Post) => (
            <HomePageCard key={post._id} post={post} />
          ))}
        </InfiniteScroll>
      </div>
      <div
        onClick={handleLogout}
        className="col-span-1 md:block hidden px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
      >
        <span className="font-semibold text-sm">Log out</span>
      </div>
    </div>
  );
};

export default HomePage;
