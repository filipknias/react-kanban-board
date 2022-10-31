import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface User {
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
    updateEmail: (state, { payload }: PayloadAction<string>) => {
      if (state.user) state.user.email = payload;
    },  
  },
})

export const { signIn, logout, updateEmail } = authSlice.actions;

export default authSlice.reducer;