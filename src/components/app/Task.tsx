import { Task as TaskType } from "../../utilities/types"

interface Props {
  task: TaskType;
}

export default function Task({ task }: Props) {
  return (
    <div className="bg-gray-700 rounded-md p-3 cursor-pointer transition-colors hover:bg-gray-600 flex flex-col gap-1">
      <h1 className="font-medium text-lg">{task.name}</h1>
      <p className="font-medium text-sm text-gray-400">0 of 1 subtasks</p>
    </div>
  )
};