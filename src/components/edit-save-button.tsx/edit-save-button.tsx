// components/EditSaveButton.tsx
import React from "react";
import { FaRegEdit } from "react-icons/fa";

interface EditSaveButtonProps {
  isEditing: boolean;
  saving: boolean;
  onEditToggle: () => void;
  onSave: () => void;
}

const EditSaveButton: React.FC<EditSaveButtonProps> = ({
  isEditing,
  saving,
  onEditToggle,
  onSave,
}) => {
  return (
    <>
      {isEditing ? (
        <button
          type="button"
          onClick={onSave}
          className="max-w-fit self-center text-white bg-green-500 hover:bg-green-400 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
          disabled={saving}
        >
          {saving ? (
            <span>Saving...</span>
          ) : (
            <>
              <FaRegEdit /> Simpan
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onEditToggle}
          className="max-w-fit self-center text-white bg-blue-500 hover:bg-blue-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center gap-2"
        >
          <FaRegEdit />
          Edit
        </button>
      )}
    </>
  );
};

export default EditSaveButton;
