import React from "react";
import SuccessImage from '../../images/success.png';
import FailedImage from '../../images/failed.png';
import PendingImage from '../../images/pending.png';

export default function TransferComponent(props) {
    const { name, status, progress } = props;

    return (
        <div>
            <p className="m-0">{name}</p>
            <div className="d-flex">
                {status === 'pending' && <img src={PendingImage} alt="waiting" style={{width: '20px', height: '20px'}}/>}
                {status === 'transferring' && `${progress}%`}
                {status === 'success' && <img src={SuccessImage} alt="success" style={{width: '20px', height: '20px'}}/>}
                {status === 'failed' && <img src={FailedImage} alt="failed" style={{width: '20px', height: '20px'}}/>}
            </div>
        </div>
    );
};