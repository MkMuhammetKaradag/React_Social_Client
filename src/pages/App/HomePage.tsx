import { useMutation, useQuery } from '@apollo/client';
import { useState } from 'react';
import { LOGOUT_USER } from '../../graphql/mutations/Logout';
import { useAppDispatch } from '../../context/hooks';
import { logout } from '../../context/slices/AuthSlice';
import { GET_HOMA_PAGE_POSTS } from '../../graphql/queries/GetPostsFromFollowedUsers';
import HomePageCard from '../../components/App/HomePageCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import { PostPageCardPost } from '../../utils/types';
import GetFriendSuggestions from '../../components/App/GetFriendSuggestions';

// Define types for PostUser and Post

const HomePage = () => {
  // Set up state and constants

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 2;

  // Fetch posts from followed users
  const { data, loading, error, fetchMore } = useQuery(GET_HOMA_PAGE_POSTS, {
    variables: {
      input: {
        page: 1,
        pageSize: PAGE_SIZE,
      },
    },
    onCompleted: (data) => {
      const postCount = data.getPostsFromFollowedUsers.length;
      setHasMore(postCount > 0 && postCount === PAGE_SIZE);
    },
  });

  // Load more posts when scrolling
  const loadMore = () => {
    if (!hasMore) return;
    fetchMore({
      variables: {
        input: {
          page: page + 1,
          pageSize: PAGE_SIZE,
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
          fetchMoreResult.getPostsFromFollowedUsers.length === PAGE_SIZE
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

  // Show loading state for initial load
  if (loading && page === 1) return <p>Loading...</p>;

  // Show error message if query fails
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid md:grid-cols-4 sm:grid-cols-3">
      {/* Main content area */}
      <div className="col-span-3 justify-center">
        {/* <div className="bg-red-50">Home Page</div> */}
        {/* Infinite scroll component for posts */}
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
          {/* Render posts */}
          {data?.getPostsFromFollowedUsers.map((post: PostPageCardPost) => (
            <HomePageCard key={post._id} post={post} />
          ))}
        </InfiniteScroll>
      </div>
      {/* Logout button */}
      <div className="col-span-1 xl:block hidden px-4 py-2 text-sm text-gray-700 ">
        <GetFriendSuggestions />
      </div>
    </div>
  );
};

export default HomePage;
