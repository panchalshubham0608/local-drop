import React, { useState } from "react";
import Loader from "../Loader/Loader";
import { v4 as uuidv4 } from 'uuid';
import UploadComponent from "./UploadComponent";

export default function FileUploads(props) {
    const { status, targetDeviceName, files, source, handleFileUploaded } = props;
    const [transferId, ] = useState(uuidv4());

    const waiting = (status === 'waiting_approval');
    return (
        <div className="centered theme-bg theme-size">
            {waiting &&
                <div className="d-flex flex-col align-center justify-center">
                    <p>Waiting for <strong>{targetDeviceName}</strong> to accept.</p>
                    <Loader />
                </div>
            }
            {!waiting &&
            <div>
                <p>Your files are on the way to <strong>{targetDeviceName}</strong></p>
                <div className="box item-list">
                    {files.map(file => 
                        <UploadComponent
                            key={file.name}
                            file={file}
                            status={status}
                            source={source}
                            transferId={transferId}
                            handleFileUploaded={handleFileUploaded}
                        />)}
                </div>
            </div>}
        </div>
    )
};