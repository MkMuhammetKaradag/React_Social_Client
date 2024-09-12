import React, { useState } from 'react';
import { useAppDispatch } from '../../context/hooks';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_USER_POSTS } from '../../graphql/queries/GetUserPosts';
import {
  addPostsIds,
  setPostsIds,
} from '../../context/slices/ExplorePostsSlice';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
interface Media {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  publicId: string;
}

interface Post {
  _id: string;
  commentCount: number;
  likeCount: number;
  firstMedia: Media;
}
interface UserPostsGridProps {
  userId: string;
}
const MediaItem: React.FC<{ media: Media }> = ({ media }) => {
  if (media.type === 'VIDEO') {
    return (
      <video
        src={`https://res.cloudinary.com/doarbqecd/video/upload/c_fill,w_300,h_${'300'}/v1725363937/posts/${
          media.publicId
        }`}
        className="w-full h-full object-cover"
        autoPlay={false}
      />
    );
  } else {
    return (
      <img
        src={`https://res.cloudinary.com/doarbqecd/image/upload/c_fill,w_300,h_${'300'}/v1725363937/posts/${
          media.publicId
        }`}
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }
};
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
          setPostsIds(data.getUserPosts.posts.map((post: Post) => post._id))
        );
      }
    },
    onError: (error) => {
      console.error('Sorgu sırasında hata oluştu:', error);
    },
  });
  // if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu: {error.message}</p>;
  if (!data) return <p>Veri bulunamadı</p>;
  const posts = data.getUserPosts.posts;

  const loadMore = () => {
    fetchMore({
      variables: {
        page: page + 1,
        pageSize: pageSize,
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.getUserPosts.posts.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        dispatch(
          addPostsIds(
            fetchMoreResult.getUserPosts.posts.map((post: Post) => post._id)
          )
        );
        setHasMore(fetchMoreResult.getUserPosts.posts.length === pageSize);
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
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={!(posts.length >= data.getUserPosts.totalCount)}
        loader={<h4>Yükleniyor...</h4>}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <div className="grid grid-cols-3 gap-1 md:gap-2">
          {posts.map((post: Post, index: number) => (
            <div
              key={post._id}
              className={`relative group transition-opacity col-span-1   duration-300 cursor-pointer from-black to-transparent ease-in-out `}
            >
              <Link
                to={`/p/${post._id}`}
                state={{ backgroundLocation: location }}
              >
                {/* <div>{index}</div> */}
                <MediaItem media={post.firstMedia} />
                {post.firstMedia.type === 'VIDEO' && (
                  <span className="absolute top-2 right-2 text-white">---</span>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                  <div className="text-white flex space-x-4">
                    <span className="flex items-center space-x-1">
                      <AiFillHeart size={24} />
                      <span>{post.likeCount}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <AiOutlineComment size={24}></AiOutlineComment>
                      <span>{post.commentCount}</span>
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UserPostsGrid;
