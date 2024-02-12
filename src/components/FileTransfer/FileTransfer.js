import React, { useState } from "react";
import Loader from "../Loader/Loader";
import TransferComponent from "./TransferComponent";
import { v4 as uuidv4 } from 'uuid';

export default function FileTransfer(props){
    const { uploadState, files } = props;
    const [transferId, _] = useState(uuidv4());

    return (
        <div className="centered theme-bg theme-size">
            {!uploadState.uploading &&
                <div className="d-flex flex-col align-center justify-center">
                    <p>Waiting for <strong>{uploadState.targetDeviceName}</strong> to accept.</p>
                    <Loader />
                </div>
            }
            {uploadState.uploading &&
                <div>
                    <p>Your files are on the way to <strong>{uploadState.targetDeviceName}</strong></p>
                    <div className="box item-list">
                        {files.map((file) => 
                            <TransferComponent
                                key={file.name}
                                file={file}
                                transferId={transferId}
                                source={uploadState.tokenSource}
                                />)}
                    </div>
                </div>
            }
        </div>
    )
};