import axios from 'axios';

const streamFileToServer = ({ file, source, transferId, onProgress }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-Transfer-ID': transferId,
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

export {
    streamFileToServer,
};
