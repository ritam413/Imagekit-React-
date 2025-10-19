import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import { api } from '../../utils/axiosInstance';
// --- SVG ICONS ---
// Self-contained SVGs to prevent dependency issues.
const CloudUploadIcon = ({ size = 48, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 16.002v-5.5a4 4 0 0 0-4-4h-1.5a4.5 4.5 0 1 0 .375 8.975" /><path d="m14 14-2-2-2 2" /><path d="M12 12v9" /><path d="m20.88 18.09.02.02" /><path d="m6.66 16.24.02-.02" /><path d="m2 10.5.02.02" /><path d="M18 5.5.02.02" /><path d="M22 20.5-.02-.02" />
    </svg>
);

const XIcon = ({ size = 20, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
);

const TrashIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const CheckCircleIcon = ({ size = 16, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);

// ADDED: Icon for audio files
const MusicIcon = ({ size = 48, className = "" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13"></path><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="16" r="3"></circle>
    </svg>
);


// --- HELPER FUNCTION ---
const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// --- FILE PREVIEW COMPONENT ---
const FilePreview = ({ file, onRemove }) => {
    const [progress, setProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileType, setFileType] = useState('other');

    useEffect(() => {
        if (file && file.type) {
            if (file.type.startsWith('image/')) {
                setFileType('image');
            } else if (file.type.startsWith('video/')) {
                setFileType('video');
            } else if (file.type.startsWith('audio/')) {
                setFileType('audio');
            } else {
                setFileType('other');
            }

            // Create a URL for previewing images and videos
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
                return () => URL.revokeObjectURL(url);
            }
        }
    }, [file]);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return 100;
                }
                const diff = Math.random() * 15;
                return Math.min(oldProgress + diff, 100);
            });
        }, 250);

        return () => {
            clearInterval(timer);
        };
    }, []);

    const renderPreview = () => {
        switch (fileType) {
            case 'image':
                return <img src={previewUrl} alt={file.name} className="w-full h-full object-cover" />;
            case 'video':
                // For videos, we show the first frame. The `#t=0.1` is a trick to seek to the first frame.
                return <video src={`${previewUrl}#t=0.1`} className="w-full h-full object-cover" muted playsInline />;
            case 'audio':
                return <div className="flex items-center justify-center w-full h-full"><MusicIcon className="text-gray-400" /></div>;
            default:
                return <p className="text-xs text-gray-500">No Preview</p>;
        }
    };

    return (
        <div className="relative bg-base-300 p-3 rounded-lg flex flex-col items-center text-center shadow-md">
            <div className="w-full h-32 mb-2 flex items-center justify-center bg-base-100 rounded-md overflow-hidden">
                {renderPreview()}
            </div>

            <p className="font-semibold text-sm truncate w-full" title={file.path}>{file.path}</p>
            <p className="text-xs text-gray-400 mb-2">{formatBytes(file.size)}</p>

            <div className="w-full">
                <progress
                    className={`progress ${progress === 100 ? 'progress-success' : 'progress-primary'} w-full`}
                    value={progress}
                    max="100">
                </progress>
            </div>

            <div className="absolute top-1 right-1">
                {progress < 100 ? (
                    <button
                        onClick={() => onRemove(file)} className="btn btn-ghost btn-circle btn-xs bg-black bg-opacity-40 text-white hover:bg-red-500/50">
                        <TrashIcon size={16} />
                    </button>
                ) : (
                    <>
                        <div className="text-success-content bg-success p-1 rounded-full">

                            <CheckCircleIcon size={16} />
                        </div>
                        <button
                            onClick={() => onRemove(file)} className="btn btn-ghost btn-circle btn-xs bg-black bg-opacity-40 text-white hover:bg-red-500/50">
                            <TrashIcon size={16} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

// --- MAIN UPLOAD MODAL COMPONENT ---
const UploadModal = ({ modalId , onUploadSuccess}) => {
    const [files, setFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        const newFiles = acceptedFiles.map(file => Object.assign(file, {
            id: `${file.name}-${file.lastModified}-${Math.random()}`
        }));
        setFiles(prevFiles => [...prevFiles, ...newFiles]);
    }, []);

    // UPDATED: Added audio and video MIME types to the accept prop
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/gif': ['.gif'],
            'image/webp': ['.webp'],
            'video/mp4': ['.mp4'],
            'video/webm': ['.webm'],
            'video/quicktime': ['.mov'],
            'audio/mpeg': ['.mp3'],
            'audio/wav': ['.wav'],
        }
    });

    const removeFile = (fileToRemove) => {
        setFiles(prevFiles => prevFiles.filter(file => file.id !== fileToRemove.id));
    };
    // ---- write the upload image logic here // BACKEND --- 
    const handleFinalUpload = async () => {
        console.log("Uploading all processed files to the database...");
        const filesToUpload = files;

        const formData = new FormData();
        console.log(filesToUpload);
        files.forEach(file => {
            formData.append('file', file);
        })

        const response = await api.post(`api/dashboard/uploadMedia`,formData,{withCredentials: true})

        const data =  response.data
        console.log("fetched Data : ", data)
        if (!response.status===2000) {
            toast.error("Upload Failed")
            return null
        }
        console.log("Data i got from fileuploadmodal: ",data.data)
        toast.success("Upload Success")
        if(onUploadSuccess && data ) {
            console.log("onUploadSuccess calleda from fileuploadmodal")
            onUploadSuccess(data.data)
        }
        handleClose();
    };
    //------------------------------------------
    const handleClose = () => {
        setFiles([]);
        document.getElementById(modalId).close();
    };

    return (
        <dialog id={modalId} className="modal">
            <div className="modal-box w-11/12 max-w-4xl bg-base-200">
                <form method="dialog">
                    <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={handleClose}>
                        <XIcon size={20} />
                    </button>
                </form>

                <h3 className="font-bold text-xl mb-4">Upload Your Assets</h3>

                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors duration-300
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-600 hover:border-primary'}`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center gap-4">
                        <CloudUploadIcon size={48} className={`mx-auto ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
                        {isDragActive ? (
                            <p className="text-primary font-semibold">Drop the files here...</p>
                        ) : (
                            <p>
                                <span className="font-bold text-primary">Click to upload</span> or drag and drop files here
                            </p>
                        )}
                        {/* UPDATED: Changed the description text */}
                        <p className="text-xs text-gray-500">Images, Videos, and Audio up to 10MB</p>
                    </div>
                </div>

                {files.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold mb-2">Files ready to upload ({files.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-80 overflow-y-auto pr-2">
                            {files.map((file) => (
                                <FilePreview key={file.id} file={file} onRemove={removeFile} />
                            ))}
                        </div>
                    </div>
                )}

                <div className="modal-action mt-6">
                    <button className="btn btn-ghost" onClick={handleClose}>Cancel</button>
                    <button className="btn btn-primary" onClick={handleFinalUpload} disabled={files.length === 0}>
                        Upload {files.length} {files.length === 1 ? 'File' : 'Files'}
                    </button>
                </div>
            </div>
            <form method="dialog" className="modal-backdrop">
                <button onClick={handleClose}>close</button>
            </form>
        </dialog>
    );
};

export default UploadModal;

