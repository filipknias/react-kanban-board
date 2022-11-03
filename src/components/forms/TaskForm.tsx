import { useState, useEffect } from 'react';
import { Subtask, Task, SubmitAction } from "src/utilities/types";
import useSelectedBoard from 'src/hooks/useSelectedBoard';
import { BsXLg } from 'react-icons/bs';
import useAsync from 'src/hooks/useAsync';
import { useAppSelector } from 'src/redux/hooks';
import { db, timestamp } from 'src/lib/firebase';
import { formatFirebaseError } from 'src/helpers/formatFirebaseError';
import { addDoc, collection, updateDoc, doc } from 'firebase/firestore';
import TextInput from 'src/components/utilities/TextInput';
import FormMessage from 'src/components/forms/FormMessage';

interface Props {
  formData?: Task;
  action: SubmitAction;
  onSuccess?: () => void;
}

export default function TaskForm({ formData, action, onSuccess }: Props) {
  const [title, setTitle] = useState<string>(() => formData?.name || '');
  const [description, setDescription] = useState<string>(() => formData?.description || '');
  const [subtasks, setSubtasks] = useState<Subtask[]>(() => formData?.subtasks || [{ idx: 0, name: '', done: false }]);
  const [columnId, setColumnId] = useState<string|null>(() => formData?.columnId || null);
  const user = useAppSelector((state) => state.auth.user);
  const selectedBoardId = useAppSelector((state) => state.dashboard.selectedBoardId);
  const { columns } = useSelectedBoard();

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null || selectedBoardId === null) return;
    const validSubtasks = subtasks.filter((task) => task.name !== "");
    const formattedSubtasks = validSubtasks.map((task, index) => ({ ...task, idx: index }));
    const descriptionData = description.length === 0 ? null : description;

    switch (action) {
      case "create": {
        await addDoc(collection(db, "tasks"), {
          name: title,
          description: descriptionData,
          columnId,
          userId: user.uid, 
          subtasks: formattedSubtasks,
          createdAt: timestamp 
        });
        break;
      };
      case "update": {
        if (formData === undefined) return;
        const taskRef = doc(db, "tasks", formData.id);
        await updateDoc(taskRef, {
          name: title, 
          description: descriptionData, 
          columnId, 
          subtasks: formattedSubtasks,
        });
        break;
      };
    }
  });

  useEffect(() => {
    if (formData?.columnId) return;
    // Set selected column id
    if (columns.length === 0) setColumnId(null);
    else setColumnId(columns[0].id);
  }, [columns]);

  useEffect(() => {
    if (onSuccess === undefined) return;
    if (success) onSuccess();
  }, [success]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
  };

  const updateSubtaskName = (idx: number, name: string) => {
    setSubtasks((prevSubtasks) => {
      return prevSubtasks.map((task) => {
        if (task.idx === idx) return { ...task, name };
        return task;
      })
    })
  };

  const deleteSubtask = (idx: number) => {
    if (subtasks.length === 1) return;
    setSubtasks((prevSubtasks) => {
      const newSubtasks = prevSubtasks.filter((task) => task.idx !== idx);
      return newSubtasks.map((task, index) => ({ ...task, idx: index }));
    });
  };

  const addSubtask = () => {
    setSubtasks((prevSubtasks) => [...prevSubtasks, { idx: prevSubtasks.length, name: '', done: false }]);
  };


  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        {error && (
          <FormMessage variant="error">
            {formatFirebaseError(error)}
          </FormMessage>
        )}
        <TextInput
          type="text"
          placeholder="Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="bg-gray-700 border-none outline-none p-2 rounded-sm w-full"
          placeholder="Optional description"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <div className="flex flex-col gap-3">
          <h1 className="font-medium">Subtasks</h1>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-64">
            {subtasks.map(({ idx, name }) => (
              <div key={idx} className="flex items-center gap-3">
                <TextInput
                  type="text"
                  placeholder="Subtask name"
                  value={name}
                  onChange={(e) => updateSubtaskName(idx, e.target.value)}
                />
                {subtasks.length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteSubtask(idx)} />}
              </div>
            ))}
          </div>
          <button 
            type="button" 
            className={`modal-form-light-btn ${loading ? "btn-loading" : " "}`}
            onClick={addSubtask}
          >
            Add Subtask
          </button>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="column-id" className="font-medium">Column</label>
          <select
            id="column-id"
            className="select-input"
            defaultValue={formData?.columnId}
            onChange={(e) => setColumnId(e.target.value)}
          >
            {columns.map((column) => (
              <option value={column.id} key={column.id}>{column.name}</option>
            ))}
          </select>
        </div>
      </div>
      <button type="submit" className={`modal-form-btn ${loading ? "btn-loading" : ""}`}>
        Save
      </button>
    </form>
  )
}