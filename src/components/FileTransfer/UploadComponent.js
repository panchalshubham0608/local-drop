import React, { useEffect, useState } from "react";
import TransferComponent from "./TransferComponent";
import { streamFileToServer } from "../../util";

export default function UploadComponent(props) {
    const { file, status, source, transferId } = props;
    const [progress, setProgress] = useState(0);
    const [thisStatus, setThisStatus] = useState('pending');

    useEffect(() => {
        if (status === 'waiting_approval') return;
        if (thisStatus !== 'pending') return;
        setThisStatus('transferring');
        console.log('sending request...', {
            status, thisStatus, file, source, transferId, setProgress,            
        });
        streamFileToServer({
            file,
            source,
            transferId,
            onProgress: (p) => setProgress(p),
        }).then(response => {
            console.log(response);
            setThisStatus('success');
        }).catch(err => {
            console.log(err);
            setThisStatus('failed');
        });
    }, [status, thisStatus, file, source, transferId, setProgress]);

    return (
        <TransferComponent
            name={file.name}
            status={thisStatus}
            progress={progress}
        />
    );
}