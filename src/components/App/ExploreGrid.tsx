import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';
import { AiFillHeart, AiOutlineComment } from 'react-icons/ai';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch } from '../../context/hooks';
import {
  addPostsIds,
  setPostsIds,
} from '../../context/slices/ExplorePostsSlice';
// GraphQL query tipi
const DISCOVER_POSTS = gql`
  query discoverPost($page: Float!, $pageSize: Float!) {
    discoverPosts(input: { page: $page, pageSize: $pageSize }) {
      posts {
        _id
        score
        commentCount
        likeCount
        firstMedia {
          url
          publicId
          type
        }
      }
      totalCount
    }
  }
`;

// Tip tanımlamaları
interface Media {
  url: string;
  type: 'IMAGE' | 'VIDEO';
  publicId: string;
}

interface Post {
  _id: string;
  score: number;
  commentCount: number;
  likeCount: number;
  firstMedia: Media;
}

interface DiscoverPostsData {
  discoverPosts: Post[];
}

interface DiscoverPostsVars {
  page: number;
  pageSize: number;
}

const MediaItem: React.FC<{ media: Media; rowSpan: boolean }> = ({
  media,
  rowSpan,
}) => {
  if (media.type === 'VIDEO') {
    return (
      <video
        src={`https://res.cloudinary.com/doarbqecd/video/upload/c_fill,w_300,h_${
          rowSpan ? '600' : '300'
        }/v1725363937/posts/${media.publicId}`}
        className="w-full h-full object-cover"
        autoPlay={false}
      />
    );
  } else {
    return (
      <img
        src={`https://res.cloudinary.com/doarbqecd/image/upload/c_fill,w_300,h_${
          rowSpan ? '600' : '300'
        }/v1725363937/posts/${media.publicId}`}
        alt=""
        className="w-full h-full object-cover"
      />
    );
  }
};

const ExploreGrid: React.FC = () => {
  const dispatch = useAppDispatch();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const pageSize = 10;
  const { loading, error, data, fetchMore } = useQuery(DISCOVER_POSTS, {
    variables: { page: 1, pageSize: 10 },
    onCompleted: (data) => {
      if (data.discoverPosts.posts) {
        dispatch(
          setPostsIds(data.discoverPosts.posts.map((post: Post) => post._id))
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

  const posts = data.discoverPosts.posts;

  const loadMore = () => {
    fetchMore({
      variables: {
        page: page + 1,
        pageSize: pageSize,
      },

      updateQuery: (prev, { fetchMoreResult }) => {
        if (
          !fetchMoreResult ||
          fetchMoreResult.discoverPosts.posts.length === 0
        ) {
          setHasMore(false);
          return prev;
        }
        setPage(page + 1);
        dispatch(
          addPostsIds(
            fetchMoreResult.discoverPosts.posts.map((post: Post) => post._id)
          )
        );
        setHasMore(fetchMoreResult.discoverPosts.posts.length === pageSize);
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
  };

  return (
    <div className="container mx-auto px-4">
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={!(posts.length >= data.discoverPosts.totalCount)}
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
              className={`relative group transition-opacity col-span-1   duration-300 cursor-pointer from-black to-transparent ease-in-out  ${
                index % 10 === 2 || index % 10 === 5 ? 'row-span-2' : ''
              }`}
            >
              <Link
                to={`/p/${post._id}`}
                state={{ backgroundLocation: location }}
              >
                {/* <div>{index}</div> */}
                <MediaItem
                  rowSpan={index % 10 === 2 || index % 10 === 5}
                  media={post.firstMedia}
                />
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

export default ExploreGrid;
