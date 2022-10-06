import { useMemo } from 'react';
import { Board, Column, Task } from '../utilities/types';
import { useAppSelector } from '../redux/hooks';

export default function useSelectedBoard() {
  const { selectedBoardId, boards, columns, tasks } = useAppSelector((state) => state.dashboard);

  const currentBoard: Board|null = useMemo(() => {
    if (selectedBoardId === null) return null;
    return boards.find(({ id }) => id === selectedBoardId) || null;
  }, [selectedBoardId, boards]);

  const currentColumns: Column[] = useMemo(() => {
    return columns.filter(({ boardId }) => boardId === selectedBoardId);
  }, [selectedBoardId, columns]);

  const currentTasks: Task[] = useMemo(() => {
    const boardTasks: Task[] = [];
    currentColumns.forEach(({ id }) => {
      const columnsTasks = tasks.filter(({ columnId }) => columnId === id);
      boardTasks.push(...columnsTasks);
    });
    return boardTasks;
  }, [currentColumns, tasks]);

  return {
    board: currentBoard,
    columns: currentColumns,
    tasks: currentTasks,
  }
};