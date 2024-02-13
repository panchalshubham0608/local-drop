import React, { useEffect, useState } from "react";
import TransferComponent from "./TransferComponent";
import { downloadFileFromServer } from "../../util";

export default function DownloadComponent(props) {
    const { file, source } = props;
    const [progress, setProgress] = useState(0);
    const [thisStatus, setThisStatus] = useState(file.status);
    
    useEffect(() => {
        if (thisStatus !== 'available') return;
        setThisStatus('transferring');
        downloadFileFromServer({
            file,
            source,
            onProgress: (p) => setProgress(p),
        }).then(() => {
            setThisStatus('success');
        }).catch(err => {
            console.log(err);
            setThisStatus('failed');
        });
    }, [thisStatus, setThisStatus, file, source, setProgress]);

    return (
        <TransferComponent
            name={file.name}
            status={thisStatus}
            progress={progress}
        />
    );
};
