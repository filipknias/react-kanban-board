import Modal from "./Modal"
import { useEffect, useState } from 'react';
import useAsync from '../../hooks/useAsync';
import { addDoc, collection } from 'firebase/firestore';
import { db, timestamp } from '../../lib/firebase';
import { formatFirebaseError } from '../../helpers/formatFirebaseError';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { hideModal } from '../../redux/features/modalsSlice';
import { Subtask } from "../../utilities/types";
import useSelectedBoard from '../../hooks/useSelectedBoard';
import { BsXLg } from 'react-icons/bs';

export default function AddTaskModal() {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [subtasks, setSubtasks] = useState<Subtask[]>([{ idx: 0, name: '', done: false }]);
  const [columnId, setColumnId] = useState<string|null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const selectedBoardId = useAppSelector((state) => state.dashboard.selectedBoardId);
  const dispatch = useAppDispatch();
  const { columns } = useSelectedBoard();

  const { trigger, error, loading, success } = useAsync(async () => {
    if (user === null || selectedBoardId === null) return;

    await addDoc(collection(db, "tasks"), {
      name: title,
      description: description.length === 0 ? null : description,
      columnId,
      userId: user.uid, 
      subtasks,
      createdAt: timestamp 
    });
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trigger();
  };

  useEffect(() => {
    // Hide modal on success
    if (success) dispatch(hideModal());
  }, [success]);

  useEffect(() => {
    // Set selected column id
    if (columns.length === 0) setColumnId(null);
    else setColumnId(columns[0].id);
  }, [columns]);

  const updateSubtaskName = (idx: number, name: string) => {
    setSubtasks((prevSubtasks) => {
      return prevSubtasks.map((task) => {
        if (task.idx === idx) return { ...task, name };
        else return task;
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
    <Modal>
      <form className="modal-container flex flex-col gap-5" onSubmit={handleSubmit}>
        <h1 className="text-lg font-medium">Add Task</h1>
        <div className="flex flex-col gap-3">
          {error && (
            <div className="auth-form-error-message">{formatFirebaseError(error)}</div>
          )}
          <input 
            type="text"
            className="text-input"
            placeholder="Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="text-input"
            placeholder="Optional description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <div className="flex flex-col gap-3">
            <h1 className="font-medium">Subtasks</h1>
            {subtasks.map(({ idx, name }) => (
              <div key={idx} className="flex items-center gap-3">
                <input 
                  type="text"
                  className="text-input"
                  placeholder="Subtask name"
                  required
                  value={name}
                  onChange={(e) => updateSubtaskName(idx, e.target.value)}
                />
                {subtasks.length > 1 && <BsXLg className="text-gray-200 cursor-pointer" onClick={() => deleteSubtask(idx)} />}
              </div>
            ))}
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
    </Modal>
  )
}