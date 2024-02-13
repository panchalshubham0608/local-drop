import React, { useEffect, useState } from "react";
import { streamFileToServer } from '../../util';
import SuccessImage from '../../images/success.png';
import FailedImage from '../../images/failed.png';

export default function TransferComponent(props) {
    const { file, source, transferId, onDone, uploading } = props;
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('pending');
    const [requestSent, setRequestSent] = useState(false);

    useEffect(() => {
        console.log('testing...');
        if (uploading && !requestSent) {
            setRequestSent(true);
            console.log('uploading', file.name);
            streamFileToServer({
                file,
                source,
                transferId,
                onProgress: (p) => setProgress(p),
            }).then(response => {
                setStatus('success');
                onDone(response.file);
            }).catch(err => {
                console.log(err);
                setStatus('failed');
                onDone(null);
            });
        }
    }, [file, setProgress, onDone, source, transferId, setStatus, uploading, requestSent, setRequestSent]);

    return (
        <div>
            <p className="m-0">
                {file.name}
            </p>
            <div className="d-flex">
                {status === 'pending' && `${progress}%`}
                {status === 'success' && <img src={SuccessImage} alt="success" style={{width: '20px', height: '20px'}}/>}
                {status === 'failed' && <img src={FailedImage} alt="failed" style={{width: '20px', height: '20px'}}/>}
            </div>
        </div>
    );
};