import { Column as ColumnType } from 'src/utilities/types';
import { useMemo } from 'react';
import useSelectedBoard from 'src/hooks/useSelectedBoard';
import Task from 'src/components/app/Task';

interface Props {
  column: ColumnType;
}

export default function Column({ column }: Props) {
  const { tasks } = useSelectedBoard();

  const columnTasks = useMemo(() => {
    return tasks.filter((task) => task.columnId === column.id);
  }, [tasks, column]);

  return (
    <div className="flex flex-col gap-3 w-full lg:w-64 h-full overflow-y-auto shrink-0">
      <h1 className="font-bold text-gray-400 uppercase">{column.name}</h1>
      <div className={`h-full rounded-md flex flex-col gap-4 ${columnTasks.length === 0 ? 'border-dashed border-2 border-gray-700' : ''}`}>
        {columnTasks.map((task) => <Task task={task} key={task.id} />)}
      </div>
    </div>
  )
};