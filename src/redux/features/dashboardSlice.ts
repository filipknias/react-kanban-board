import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Board } from '../../utilities/types';
import { collection, query, where, getDocs, CollectionReference } from "firebase/firestore";
import { db } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';

interface DashboardState {
  boards: Board[];
  selectedBoardId: string|null;
  loading: boolean;
  error: string|null;
}

const initialState: DashboardState = {
  boards: [],
  selectedBoardId: null,
  loading: false,
  error: null,
}

export const fetchBoards = createAsyncThunk<Board[], string, { rejectValue: string }>('dashboard/fetchBoards', async (userId , { rejectWithValue }) => {
  try {
    const q = query(collection(db, "boards") as CollectionReference<Board>, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const boards: Board[] = [];
    querySnapshot.forEach((doc) => boards.push(doc.data()));
    return boards;  
  } catch (err: any) {
    console.log(err);
    return rejectWithValue(err.code);
  }
});

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedBoardId: (state, { payload }: PayloadAction<string>) => {
      state.selectedBoardId = payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBoards.pending, (state) => {
      state.error = null;
      state.loading = true;
    });
    builder.addCase(fetchBoards.fulfilled, (state, { payload }) => {
      state.boards = payload;
      state.loading = false;
    });
    builder.addCase(fetchBoards.rejected, (state, { payload }) => {
      if (payload) state.error = formatFirebaseError(payload);
      state.loading = false;
    });
  }
});

export const { setSelectedBoardId } = dashboardSlice.actions;

export default dashboardSlice.reducer;