import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

interface User {
  uid: string;
  email: string|null;
  displayName: string|null;
}

interface AuthState {
  user: User|null;

}

const initialState: AuthState = {
  user: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
})

export const { signIn, logout } = authSlice.actions;

export default authSlice.reducer;