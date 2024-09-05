import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AppState {
  searchText: string;
}

const initialState: AppState = {
  searchText: '',
};

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
  },
});

export const { setSearchText } = appSlice.actions;

export default appSlice.reducer;