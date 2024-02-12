import React from "react";
import Loader from "../Loader/Loader";

export default function FileTransfer(props){
    const { uploadState, files } = props;

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
                        <div>                            
                            <p key={1} className="m-0">
                                {file}
                            </p>
                            <div>
                                90%
                            </div>    
                        </div>                                
                        )}
                    </div>
                </div>
            }
        </div>
    )
};