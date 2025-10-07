import React from "react";

const FileModal = ({ file, isOpen, onClose }) => {
  if (!isOpen) return null;

  const renderPreview = () => {
    if (!file) return null;
    if (file.type.startsWith("image")) {
      return <img src={file.url} alt={file.name} className="max-h-96 mx-auto" />;
    } else if (file.type.startsWith("video")) {
      return (
        <video controls className="max-h-96 mx-auto">
          <source src={file.url} type={file.type} />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return (
        <a
          href={file.url}
          download={file.name}
          className="text-blue-500 underline"
        >
          Download {file.name}
        </a>
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{file?.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 font-bold"
          >
            X
          </button>
        </div>

        <div>{renderPreview()}</div>
      </div>
    </div>
  );
};

export default FileModal;
