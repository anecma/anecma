import React, { useEffect } from "react";
import { IoCloseCircle } from "react-icons/io5";

interface TextModalProps {
  isOpen: boolean;
  onClose: () => void;
  textContent: string;
}

const TextModal: React.FC<TextModalProps> = ({
  isOpen,
  onClose,
  textContent,
}) => {
  useEffect(() => {
    // Disable scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto"; // Re-enable scroll when modal is closed
    }

    // Cleanup the effect when the component is unmounted or modal is closed
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]); // Runs when `isOpen` state changes

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
      aria-hidden={!isOpen}
    >
      <div className="bg-white rounded-lg p-4 relative max-w-4xl w-full shadow-lg overflow-auto">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-opacity-50 backdrop-blur-md text-red-600 hover:text-red-800 focus:outline-none shadow-md transition-transform transform hover:scale-110 rounded-full p-2"
          aria-label="Close modal"
        >
          <IoCloseCircle className="w-8 h-8" />
        </button>
        <div className="modal-body text-sm md:text-base">
          <div
            dangerouslySetInnerHTML={{
              __html: textContent, // Render the dynamic textContent
            }}
            className="text-gray-700 text-justify"
          />
        </div>
      </div>
    </div>
  );
};

export default TextModal;
