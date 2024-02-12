import axios from 'axios';

const streamFileToServer = async (file) => {
    try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                console.log(`Upload Progress: ${progress}%`);
            },
        });

        console.log('File uploaded successfully:', response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export default streamFileToServer;
