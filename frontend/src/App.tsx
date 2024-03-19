import React, { useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useClickOutside } from './hooks/custom/use-click-outside';
import { useDeleteFile } from './hooks/mutation/delete-file';
import { useUploadFile } from './hooks/mutation/upload-file';
import { useGetFileTitles } from './hooks/query/get-file-titles';
import { downloadFile } from './services/file.api';
import { FileExtension, FileTitleDTO } from './services/file.types';

const FileItem = ({
    file,
    handleDelete,
    handlePreview,
}: {
    file: FileTitleDTO;
    handleDelete: (id: string) => void;
    handlePreview: (file: FileTitleDTO) => void;
}) => (
    <li key={file.title}>
        <p>{file.title}</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => handleDelete(file.id)}>
                <FaTrash />
            </button>
            <button onClick={() => handlePreview(file)}>
                <FaEye />
            </button>
        </div>
    </li>
);

const Modal = ({
    isOpen,
    onClose,
    imageUrl,
    fileUrl,
}: {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string | null;
    fileUrl: string | null;
}) => {
    const iframeNode = useClickOutside<HTMLIFrameElement>(onClose);
    const imgNode = useClickOutside<HTMLImageElement>(onClose);

    return (
        isOpen && (
            <div className='modal'>
                <div className='modal-content'>
                    <span className='close' onClick={onClose}>
                        <IoMdClose />
                    </span>
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt='Preview'
                            style={{ maxWidth: '100%', maxHeight: '800px' }}
                            ref={imgNode}
                        />
                    )}
                    {fileUrl && (
                        <iframe src={fileUrl} title='PDF Preview' width='1500px' height='850px' ref={iframeNode} />
                    )}
                </div>
            </div>
        )
    );
};

function App() {
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    const [modalFileUrl, setModalFileUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: files, isLoading, error } = useGetFileTitles();
    const { mutate: deleteFile } = useDeleteFile();
    const { mutate: uploadFile } = useUploadFile();

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) uploadFile(file);
    };

    const handleFileDownload = async (file: FileTitleDTO) => {
        const { id, title } = file;
        const fileExtension = title.split('.').pop();
        if (!fileExtension) return;

        const result = await downloadFile(id, title, fileExtension as FileExtension);

        const imageExtensions = [FileExtension.JPG, FileExtension.JPEG, FileExtension.PNG, FileExtension.BMP];

        if (imageExtensions.includes(fileExtension as FileExtension)) {
            result && setModalImageUrl(result);
            setIsModalOpen(true);
        } else if (fileExtension === FileExtension.PDF) {
            result && setModalFileUrl(result);
            setIsModalOpen(true);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalImageUrl(null);
        setModalFileUrl(null);
    };

    return (
        <main>
            <h1>File Preview</h1>
            <input type='file' onChange={handleUpload} accept='.bmp,.doc,.docx,.jpeg,.jpg,.msg,.pdf,.png,.xlsx' />

            <ul>
                {isLoading && <li>Loading...</li>}
                {error && <li>Error fetching file titles</li>}
                {files?.map((file: FileTitleDTO) => (
                    <FileItem
                        key={file.title}
                        file={file}
                        handleDelete={deleteFile}
                        handlePreview={handleFileDownload}
                    />
                ))}
                {files?.length === 0 && <p>No files found</p>}
            </ul>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} imageUrl={modalImageUrl} fileUrl={modalFileUrl} />
        </main>
    );
}

export default App;
