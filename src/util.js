import axios from 'axios';

let origin = window.location.origin;
let originWithoutPort = origin.substring(0, origin.length - 5);
const baseUrl = `${originWithoutPort}:8080`;

const streamFileToServer = ({ file, source, transferId, onProgress }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(`${baseUrl}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Transfer-ID': transferId,
                    'X-File-ID': file.id,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    onProgress(progress);
                },
                cancelToken: source.token, // Pass the cancel token to the request
            });

            resolve(response.data);
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
                reject(error.message);
            } else {
                console.error('Error uploading file:', error);
                reject(error);
            }
        }
    });
};

const downloadFileFromServer = ({ file, source, onProgress }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`${baseUrl}/download`, {
                responseType: 'blob',
                headers: {
                    'X-Blob-Path': file.path,
                },
                onDownloadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    onProgress(progress);
                },
                cancelToken: source.token, // Pass the cancel token to the request
            });

            const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', file.name);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            resolve();
        } catch (error) {
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message);
                reject(error.message);
            } else {
                console.error('Error uploading file:', error);
                reject(error);
            }
        }
    });
};

export {
    baseUrl,
    streamFileToServer,
    downloadFileFromServer,
};
