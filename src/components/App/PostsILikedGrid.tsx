import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_POSTS_I_LIKED } from '../../graphql/queries/GetPostsILiked';
import { useAppDispatch } from '../../context/hooks';
import { ExplorePageCardPost } from '../../utils/types';
import { setPostsIds } from '../../context/slices/ExplorePostsSlice';
import { PostCard } from './ExploreGrid';

const PostsILikedGrid = () => {
  const dispatch = useAppDispatch();
  const { loading, error, data, fetchMore } = useQuery(GET_POSTS_I_LIKED, {
    onCompleted: (data) => {
      if (data.getPostsILiked) {
        dispatch(
          setPostsIds(
            data.getPostsILiked.map((post: ExplorePageCardPost) => post._id)
          )
        );
      }
    },
    onError: (error) => {
      console.error('Sorgu sırasında hata oluştu:', error);
    },
  });
  if (loading) return <p>Yükleniyor...</p>;
  if (error) return <p>Hata oluştu: {error.message}</p>;
  if (!data) return <p>Veri bulunamadı</p>;
  const posts = data.getPostsILiked;
  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {posts.map((post: ExplorePageCardPost) => (
        <PostCard key={post._id} post={post} />
      ))}
    </div>
  );
};

export default PostsILikedGrid;
