import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { User } from 'firebase/auth';

interface AuthState {
  user: User|null;

}

const initialState: AuthState = {
  user: null,
}

export const counterSlice = createSlice({
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

export const { signIn, logout } = counterSlice.actions;

export default counterSlice.reducer;