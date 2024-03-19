import { useState } from 'react';
import { FaEye, FaTrash } from 'react-icons/fa';
import { IoMdClose } from 'react-icons/io';
import { useDeleteFile } from './hooks/mutation/delete-file';
import { useUploadFile } from './hooks/mutation/upload-file';
import { useGetFileTitles } from './hooks/query/get-file-titles';
import { downloadFile } from './services/file.api';
import { FileExtension, FileTitleDTO } from './services/file.types';

function App() {
    const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
    const [modalFileUrl, setmodalFileUrl] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data: files, isLoading, error } = useGetFileTitles();
    const { mutate: deleteFile } = useDeleteFile();
    const { mutate: uploadFile } = useUploadFile();

    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }
        uploadFile(file);
    };

    const handleFileDownload = async (fileId: string, fileTitle: string) => {
        const fileExtension = fileTitle.split('.').pop();
        if (!fileExtension) {
            return;
        }

        const result = await downloadFile(fileId, fileTitle, fileExtension as FileExtension);
        const imageExtensions = [FileExtension.JPG, FileExtension.JPEG, FileExtension.PNG, FileExtension.BMP];

        if (imageExtensions.includes(fileExtension as FileExtension)) {
            result && handleImagePreview(result);
        }

        if (fileExtension === FileExtension.PDF) {
            result && handlePDFPreview(result);
        }
    };

    const handleImagePreview = (imageUrl: string) => {
        setModalImageUrl(imageUrl);
        setIsModalOpen(true);
    };

    const handlePDFPreview = (fileUrl: string) => {
        setmodalFileUrl(fileUrl);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalImageUrl(null);
        setmodalFileUrl(null);
    };

    return (
        <main>
            <h1>File Preview</h1>
            <input type='file' onChange={handleUpload} accept='.bmp,.doc,.docx,.jpeg,.jpg,.msg,.pdf,.png,.xlsx' />

            <ul>
                {isLoading && <li>Loading...</li>}
                {error && <li>Error fetching file titles</li>}
                {files?.map((file: FileTitleDTO) => (
                    <li key={file.title}>
                        <p>{file.title}</p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => deleteFile(file.id)}>
                                <FaTrash />
                            </button>
                            <button
                                onClick={() => {
                                    handleFileDownload(file.id, file.title);
                                }}>
                                <FaEye />
                            </button>
                        </div>
                    </li>
                ))}
                {files?.length === 0 && <p>No files found</p>}
            </ul>

            {isModalOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <span className='close' onClick={handleCloseModal}>
                            <IoMdClose />
                        </span>
                        {modalImageUrl && (
                            <img src={modalImageUrl} alt='Preview' style={{ maxWidth: '100%', maxHeight: '700px' }} />
                        )}
                        {modalFileUrl && (
                            <iframe src={modalFileUrl} title='PDF Preview' width='1500px' height='850px' />
                        )}
                    </div>
                </div>
            )}
        </main>
    );
}

export default App;
