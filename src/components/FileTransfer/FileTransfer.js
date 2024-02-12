import React, { useState } from "react";
import Loader from "../Loader/Loader";
import TransferComponent from "./TransferComponent";
import { v4 as uuidv4 } from 'uuid';

export default function FileTransfer(props){
    const { transferState, files, handleIndividualFileTransferred } = props;
    const [transferId, ] = useState(uuidv4());
    const [done, setDone] = useState(new Array(files.length).fill(false));

    let allDone = done.reduce((acc, curr) => acc && curr, true);
    return (
        <div className="centered theme-bg theme-size">
            {!transferState.uploading &&
                <div className="d-flex flex-col align-center justify-center">
                    <p>Waiting for <strong>{transferState.targetDeviceName}</strong> to accept.</p>
                    <Loader />
                </div>
            }
            {(transferState.uploading || transferState.downloading) &&
                <div>
                    {!allDone &&
                    <p>Your files are on the way {transferState.uploading ? 'to' : 'from'} <strong>{transferState.targetDeviceName}</strong></p>}
                    {allDone &&
                    <div className="d-flex flex-col" style={{marginBottom: '10px'}}>
                        <p>Your files have been {transferState.uploading ? 'sent to' : 'received from'} <strong>{transferState.targetDeviceName}</strong></p>
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>Start new transfer</button>
                    </div>}
                    <div className="box item-list">
                        {files.map((file) => 
                            <TransferComponent
                                key={file.name}
                                file={file}
                                transferId={transferId}
                                source={transferState.tokenSource}
                                onDone={(file) => {                                    
                                    setDone(done => done.map((d, i) => i === files.indexOf(file) ? true : d));
                                    handleIndividualFileTransferred(file);
                                }}
                                uploading={transferState.uploading}
                            />)}
                    </div>
                </div>
            }
        </div>
    )
};