import React from "react";
import DownloadComponent from "./DownloadComponent";

export default function FileDownloads(props){
    const { targetDeviceName, files, source } = props;

    return (
        <div className="centered theme-bg theme-size">
            <div>
                <p>Your files are on the way from <strong>{targetDeviceName}</strong></p>
                <div className="box item-list">
                    {files.map(file => 
                        <DownloadComponent
                            key={file.name}
                            file={file}
                            source={source}
                        />)}
                </div>
            </div>
        </div>
    );
}