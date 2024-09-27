// slices/AuthSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  _id: string;
  interests: string[];
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  isPrivate: boolean;
  profilePhoto: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
    },
    setUpdateUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    setUserInterests: (state, action: PayloadAction<string[]>) => {
      state.user!.interests = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, logout, setUpdateUser, setUserInterests } =
  authSlice.actions;
export default authSlice.reducer;
