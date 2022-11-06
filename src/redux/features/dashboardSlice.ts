import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { Board, Column, Task } from 'src/utilities/types';

interface DashboardState {
  selectedBoardId: string|null;
  boards: Board[];
  columns: Column[];
  tasks: Task[];
}

const initialState: DashboardState = {
  selectedBoardId: null,
  boards: [],
  columns: [],
  tasks: [],
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setSelectedBoardId: (state, { payload }: PayloadAction<string|null>) => {
      state.selectedBoardId = payload;
    },
    setBoards: (state, { payload }: PayloadAction<Board[]>) => {
      if (state.selectedBoardId === null) {
        state.selectedBoardId = payload[0].id;
      }
      state.boards = payload;
    },
    setColumns: (state, { payload }: PayloadAction<Column[]>) => {
      state.columns = payload;
    },
    setTasks: (state, { payload }: PayloadAction<Task[]>) => {
      state.tasks = payload;
    },
  },
});

export const { setSelectedBoardId, setBoards, setColumns, setTasks } = dashboardSlice.actions;

export default dashboardSlice.reducer;