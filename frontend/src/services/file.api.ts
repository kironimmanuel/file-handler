import { AxiosResponse } from 'axios';
import { multipartHttpClient, octetStreamHttpClient } from '../lib/httpClient';
import { FileExtension } from './file.types';

export const getFileTitles = async () => {
    const response: AxiosResponse = await multipartHttpClient.get('files');

    if (response.status === 200) {
        return response.data;
    }

    throw new Error('Error fetching file titles');
};

export const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response: AxiosResponse = await multipartHttpClient.post('files/upload', formData);

    if (response.status === 200) {
        return null;
    }

    throw new Error('Error uploading file');
};

export const deleteFile = async (fileId: string) => {
    const response: AxiosResponse = await multipartHttpClient.delete(`files/${fileId}`);

    if (response.status === 200) {
        return null;
    }

    throw new Error('Error deleting file');
};

export const downloadFile = async (fileId: string, fileTitle: string, fileExtension: FileExtension) => {
    try {
        const response: AxiosResponse = await octetStreamHttpClient.get(`files/download/${fileId}`, {
            responseType: 'arraybuffer',
        });

        if (response.status === 200) {
            const blob = new Blob([response.data]);
            const urlObject = window.URL.createObjectURL(blob);

            switch (fileExtension) {
                case FileExtension.JPEG:
                case FileExtension.JPG:
                case FileExtension.PNG:
                case FileExtension.BMP: {
                    return urlObject;
                }

                case FileExtension.PDF: {
                    return urlObject;
                }

                case FileExtension.DOC:
                case FileExtension.DOCX:
                case FileExtension.MSG:
                case FileExtension.XLSX: {
                    console.log('Preview DOC, DOCX, XLSX, MSG file');
                    const link = document.createElement('a');
                    link.href = urlObject;
                    link.download = `${fileTitle}.${fileExtension}`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    link.remove();
                    break;
                }
                default:
                    throw new Error('File extension not supported');
            }
        } else {
            throw new Error('Error downloading file');
        }
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};
