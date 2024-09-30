import React from 'react';
import PostsILikedGrid from '../../components/App/PostsILikedGrid';

const PostsILikedPage = () => {
  return (
    <div className="w-full  h-full mt-10 p-6 relative space-y-4 overflow-auto">
      <div className="fixed top-8 z-50 bg-gray-200 p-1 rounded-md">
        <h1 className="text-2xl font-bold"> Posts I Liked</h1>
      </div>
      <PostsILikedGrid></PostsILikedGrid>
    </div>
  );
};

export default PostsILikedPage;
