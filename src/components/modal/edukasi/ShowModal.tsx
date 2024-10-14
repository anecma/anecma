import React from "react";
import parse from "html-react-parser";

interface ShowModalProps {
  item: {
    judul: string;
    konten: string;
    jenis: string;
    kategori: string;
  };
  onClose: () => void;
}

const ShowModal: React.FC<ShowModalProps> = ({ item, onClose }) => {
  const renderBadge = (text: string, color: string) => (
    <span
      className={`inline-flex items-center px-3 py-1 text-sm font-medium text-white ${color} rounded-full`}
    >
      {text}
    </span>
  );

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            {renderBadge(item.jenis, "bg-green-500")} {/* Badge for jenis */}
          </div>
          <h3 className="text-lg font-semibold text-center flex-1 mx-4">
            {item.judul}
          </h3>
          <div className="flex items-center">
            {renderBadge(item.kategori, "bg-blue-500")}{" "}
            {/* Badge for kategori */}
          </div>
        </div>

        <div className="mb-4">
          <strong>Konten:</strong>
          <div className="mt-2 overflow-y-auto max-h-60">
            {parse(item.konten)}
          </div>
        </div>

        <div className="mt-4 text-right">
          <button
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
            onClick={onClose}
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShowModal;
