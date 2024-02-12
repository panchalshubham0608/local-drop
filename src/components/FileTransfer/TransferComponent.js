import React, { useEffect, useState } from "react";
import { streamFileToServer } from '../../util';

export default function TransferComponent(props) {
    const { file, source, transferId } = props;
    const [progress, setProgress] = useState(0);
    console.log(file);

    useEffect(() => {
        streamFileToServer({
            file,
            source,
            transferId,
            onProgress: (p) => setProgress(p),
        }).then(() => {
            alert('done');
        }).catch(err => {
            alert('failed');
        });
    }, [streamFileToServer, file, setProgress]);

    return (
        <div>
            <p className="m-0">
                {file.name}
            </p>
            <div>
                {progress}%
            </div>
        </div>
    );
};