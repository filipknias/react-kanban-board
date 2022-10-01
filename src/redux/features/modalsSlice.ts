import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface ModalsState {
  openedModal: JSX.Element|null;
}

const initialState: ModalsState = {
  openedModal: null,
}

export const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal: (state, { payload }: PayloadAction<JSX.Element>) => {
      state.openedModal = payload;
    },
    hideModal: (state) => {
      state.openedModal = null;
    },
  },
})

export const { openModal, hideModal } = modalsSlice.actions;

export default modalsSlice.reducer;