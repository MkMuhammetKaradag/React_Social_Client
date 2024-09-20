import React, { useCallback, useState } from 'react';
import { useAppDispatch } from '../../context/hooks';
import {  useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_POSTS } from '../../graphql/queries/GetUserPosts';
import {
  addPostsIds,
  setPostsIds,
} from '../../context/slices/ExplorePostsSlice';
import InfiniteScroll from 'react-infinite-scroll-component';

import { ExplorePageCardPost } from '../../utils/types';
import { PostCard } from './ExploreGrid';

interface UserPostsGridProps {
  userId: string;
}

const UserPostsGrid: React.FC<UserPostsGridProps> = ({ userId }) => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const pageSize = 10;
  const { loading, error, data, fetchMore } = useQuery(GET_USER_POSTS, {
    variables: {
      input: {
        userId,
        page: 1,
        pageSize: 10,
      },
    },
    onCompleted: (data) => {
      if (data.getUserPosts.posts) {
        dispatch(
          setPostsIds(
            data.getUserPosts.posts.map((post: ExplorePageCardPost) => post._id)
          )
        );
        setHasMore(data.getUserPosts.posts.length === pageSize);
      }
    },
    onError: (error) => {
      console.error('Sorgu sırasında hata oluştu:', error);
    },
  });

  const loadMore = useCallback(() => {
    fetchMore({
      variables: {
        input: {
          userId,
          page: page + 1,
          pageSize,
        },
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getUserPosts.posts.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage((prev) => prev + 1);
        dispatch(
          addPostsIds(
            fetchMoreResult.getUserPosts.posts.map(
              (post: ExplorePageCardPost) => post._id
            )
          )
        );
        setHasMore(fetchMoreResult.getUserPosts.posts.length === pageSize);
        console.log(page, pageSize);
        console.log(fetchMoreResult.getUserPosts.posts);
        return {
          getUserPosts: {
            ...prev.getUserPosts,
            posts: [
              ...prev.getUserPosts.posts,
              ...fetchMoreResult.getUserPosts.posts,
            ],
          },
        };
      },
    });
  }, [dispatch, fetchMore, page]);
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu: {error.message}</p>;
  if (!data) return <p>Veri bulunamadı</p>;
  const posts = data.getUserPosts.posts;
  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {posts.map((post: ExplorePageCardPost) => (
            <PostCard key={post._id} post={post} location={location} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UserPostsGrid;
