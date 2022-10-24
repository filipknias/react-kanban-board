import { Column as ColumnType } from '../../utilities/types';
import { useMemo } from 'react';
import useSelectedBoard from '../../hooks/useSelectedBoard';
import Task from './Task';

interface Props {
  column: ColumnType;
}

export default function Column({ column }: Props) {
  const { tasks } = useSelectedBoard();

  const columnTasks = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id);
  }, [tasks, column]);

  return (
    <div className={`flex flex-col gap-3 lg:w-1/6 h-96 lg:h-full ${columnTasks.length > 0 ? 'overflow-y-auto' : ''}`}>
      <h1 className="font-bold text-gray-400 uppercase">{column.name}</h1>
      <div className={`h-full rounded-md flex flex-col gap-4 ${columnTasks.length === 0 ? 'border-dashed border-2 border-gray-700' : ''}`}>
        {columnTasks.map((task) => <Task task={task} key={task.id} />)}
      </div>
    </div>
  )
};