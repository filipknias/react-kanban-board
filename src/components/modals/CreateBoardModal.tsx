import Modal from "./Modal"

export default function CreateBoardModal() {
  return (
    <Modal>
      <form className="modal-container flex flex-col gap-5">
        <h1 className="text-lg font-medium">Add New Board</h1>
        <div className="flex flex-col gap-3">
          <input 
            type="text"
            className="text-input"
            placeholder="Name"
            required
          />
          <input 
            type="text"
            className="text-input"
            placeholder="Column"
            required
          />
        </div>
        <div className="flex flex-col gap-3">
          <button type="submit" className="bg-white rounded-sm py-2 px-5 w-full text-purple-700 font-medium hover:bg-opacity-80 transition-colors">Add New Column</button>
          <button type="submit" className="bg-purple-700 rounded-sm py-2 px-5 w-full text-white font-medium transition-colors hover:bg-purple-800">Create New Board</button>
        </div>
      </form>
    </Modal>
  )
}