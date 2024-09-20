import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Link, useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { useAppDispatch } from '../../context/hooks';
import {
  addPostsIds,
  setPostsIds,
} from '../../context/slices/ExplorePostsSlice';
import { ExplorePageCardPost } from '../../utils/types';
import { DISCOVER_POSTS } from '../../graphql/queries/DiscoverPosts';
import MediaItem from './MediaItem';

const ExploreGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const pageSize = 10;

  // Apollo's `useQuery` hook to fetch the initial data
  const { loading, error, data, fetchMore } = useQuery(DISCOVER_POSTS, {
    variables: { page: 1, pageSize },
    onCompleted: (data) => {
      if (data.discoverPosts.posts) {
        dispatch(
          setPostsIds(
            data.discoverPosts.posts.map(
              (post: ExplorePageCardPost) => post._id
            )
          )
        );
      }
    },
    onError: (error) => {
      console.error('Error fetching posts:', error);
    },
  });

  // This will handle fetching more posts as the user scrolls
  const loadMore = useCallback(() => {
    fetchMore({
      variables: {
        page: page + 1,
        pageSize,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.discoverPosts.posts.length === 0
        ) {
          setHasMore(false); // No more data to load
          return prev;
        }

        setPage(page + 1); // Update the current page number
        dispatch(
          addPostsIds(
            fetchMoreResult.discoverPosts.posts.map(
              (post: ExplorePageCardPost) => post._id
            )
          )
        );

        return {
          discoverPosts: {
            ...prev.discoverPosts,
            posts: [
              ...prev.discoverPosts.posts,
              ...fetchMoreResult.discoverPosts.posts,
            ],
          },
        };
      },
    });
  }, [dispatch, fetchMore, page]);

  // Loading and error handling
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!data) return <p>No data found</p>;

  const posts = data.discoverPosts.posts;

  return (
    <div className="container mx-auto px-4">
      <InfiniteScroll
        dataLength={posts.length} // The length of the posts array
        next={loadMore} // Function to load more posts
        hasMore={hasMore} // Indicates if more data is available
        loader={<h4>Loading...</h4>} // Loader while fetching more posts
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>You have seen it all!</b>
          </p>
        }
      >
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {posts.map((post: ExplorePageCardPost, index: number) => (
            <PostCard
              key={post._id}
              post={post}
              index={index}
              location={location}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

// PostCard component to handle rendering each post
export const PostCard: React.FC<{
  post: ExplorePageCardPost;
  index?: number;
  location: ReturnType<typeof useLocation>;
}> = ({ post, index, location }) => {
  // Determine if the post should take up more space
  const isRowSpan =
    index !== undefined && (index % 10 === 2 || index % 10 === 5);

  return (
    <div
      className={`relative group transition-opacity col-span-1 duration-300 cursor-pointer ${
        isRowSpan ? 'row-span-2' : ''
      }`}
    >
      <Link to={`/p/${post._id}`} state={{ backgroundLocation: location }}>
        <MediaItem rowSpan={isRowSpan} media={post.firstMedia} />
        {post.firstMedia.type === 'VIDEO' && (
          <span className="absolute top-2 right-2 text-white">---</span>
        )}
        <Overlay post={post} />
      </Link>
    </div>
  );
};

// Overlay component to show likes and comments on hover
export const Overlay: React.FC<{ post: ExplorePageCardPost }> = ({ post }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
    <div className="text-white flex space-x-4">
      <span className="flex items-center space-x-1">
        <AiFillHeart size={24} />
        <span>{post.likeCount}</span>
      </span>
      <span className="flex items-center space-x-1">
        <AiOutlineComment size={24} />
        <span>{post.commentCount}</span>
      </span>
    </div>
  </div>
);

export default ExploreGrid;
