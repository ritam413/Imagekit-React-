import { useState } from "react";
import { FiPlus } from "react-icons/fi";
import FileUploadModal from "../components/FileUploadModal.jsx";

export default function BottomGallery({ active, setActive }) {
    const modalId = "upload_modal";

    // State to store uploaded files
    const [uploads, setUploads] = useState([]);
    // Callback after successful upload from FileUploadModal
    const onUploadSuccess = (uploadedFile) => {
        setUploads((prev) => [...prev, uploadedFile[0]]); // Add new upload immediately
        console.log("Uploaded file:", uploadedFile);
    };

    return (
        <div className="h-28 bg-base-100 rounded-lg p-2 flex items-center gap-2 shadow-inner">
            <div className="flex-1 h-full overflow-x-auto flex items-center gap-2">
                {uploads.map((file, index) => (
                    <div
                        key={file._id || index}
                        className={`w-20 h-20 bg-base-300 rounded-md flex-shrink-0 overflow-hidden 
  transition-all duration-200
  ${active === file.originalUrl
                                ? "border-2 border-blue-500 scale-105 shadow-md"
                                : "border border-transparent hover:scale-105" }`}

                    >
                        <img
                            onClick={() => { setActive(file.originalUrl.trim()) }}
                            src={(file.originalUrl)}   // <-- Use originalUrl from your API
                            alt={file.fileName || `upload-${file.fileName}`}  // Use fileName for alt
                            className="w-full h-full object-cover cursor-pointer"
                        />
                        
                    </div>
                ))}

                {Array.from({ length: Math.max(0, 6 - uploads.length) }).map(
                    (_, index) => (
                        <div
                            key={`placeholder-${index}`}
                            className="w-20 h-20 bg-base-300 rounded-md flex-shrink-0"
                        />
                    )
                )}
            </div>

            <button
                onClick={() => document.getElementById(modalId).showModal()}
                className="btn btn-primary h-20 w-20 flex-shrink-0"
            >
                <FiPlus size={32} />
            </button>

            <FileUploadModal
                onUploadSuccess={onUploadSuccess}
                modalId={modalId}
            />
        </div>
    );
}
