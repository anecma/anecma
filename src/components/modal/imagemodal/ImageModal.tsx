import { FC } from 'react';
import Image from 'next/image';
import { IoCloseCircle } from "react-icons/io5";
interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageSrc: string;
}

const ImageModal: FC<ImageModalProps> = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"> 
            <div className="bg-white rounded-lg p-4 relative shadow-lg">
                <button 
                    onClick={onClose} 
                    className="absolute top-2 right-2 bg-opacity-50 backdrop-blur-md text-red-600 hover:text-red-800 focus:outline-none shadow-md transition-transform transform hover:scale-110 rounded-full p-2"
                    aria-label="Close modal" 
                >
                    <IoCloseCircle className="w-8 h-8" /> 
                </button>
                <Image 
                    src={imageSrc} 
                    alt="Modal" 
                    width={500} 
                    height={500} 
                    className="rounded" 
                />
            </div>
        </div>
    );
};

export default ImageModal;
