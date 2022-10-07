import { Column as ColumnType } from '../../utilities/types';
import { useMemo } from 'react';
import useSelectedBoard from '../../hooks/useSelectedBoard';

interface Props {
  column: ColumnType;
}

export default function Column({ column }: Props) {
  const { tasks } = useSelectedBoard();

  const columnTasks = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id);
  }, [tasks, column]);

  return (
    <div className="flex flex-col gap-3 w-64">
      <h1 className="font-bold text-gray-400 uppercase">{column.name}</h1>
      <div className={`h-full rounded-md border-2 border-gray-700 p-2 ${columnTasks.length === 0 ? 'border-dashed' : ''}`}>
        {/* TASKS */}
      </div>
    </div>
  )
};