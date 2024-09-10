import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  posts: string[];
}

const initialState: PostState = {
  posts: [],
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPostsIds: (state, action: PayloadAction<string[]>) => {
      state.posts = action.payload;
    },
    addPostsIds: (state, action: PayloadAction<string[]>) => {
      state.posts = [...state.posts, ...action.payload];
    },
  },
});

export const { setPostsIds, addPostsIds } = postsSlice.actions;
export default postsSlice.reducer;
