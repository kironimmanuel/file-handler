import { octetStreamHttpClient } from './lib/httpClient';
import { uploadDocument } from './services/file.api';

const fileExtensions = ['pdf', 'jpg', 'docx'];

function App() {
    const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        console.log(file);
        await uploadDocument(file);
    };

    const downloadAndPreviewFile = async (extension: string) => {
        console.log(extension);
        const response = await octetStreamHttpClient.get(`/files?fileType=document.${extension}`, {
            responseType: 'blob',
        });
        console.log('downloadAndPreviewFile ~ response:', response);
    };

    return (
        <main>
            <h1>File Preview</h1>
            <input type='file' onChange={handleUpload} />
            <div>
                {fileExtensions.map(extension => (
                    <button key={extension} onClick={() => downloadAndPreviewFile(extension)}>
                        Preview .{extension}
                    </button>
                ))}
            </div>
        </main>
    );
}

export default App;
