import React, { useCallback, useEffect, useState } from "react";
import RefreshIcon from '../../images/refresh-icon.webp';
import Loader from "../Loader/Loader";
import './DeviceChooser.css';

export default function DeviceChooser(props) {
    const { handleSendToDevice, thisDeviceName } = props;
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshDevices = useCallback(() => {
        setLoading(true);
        fetch(`http://localhost:8080/devices`)
        .then(response => response.json())
        .then(data => setDevices(data.devices.filter(deviceName => deviceName !== thisDeviceName)))
        .catch(err => console.log(err))
        .finally(() => setLoading(false));
    }, [setLoading, setDevices, thisDeviceName]);

    useEffect(() => {
        setTimeout(() => refreshDevices(), 1000);
    }, [refreshDevices]);

    return (
        <div className="centered theme-bg theme-size">
            <div className="text-center">
                <h1 className="m-0">
                    Available devices
                    {!loading &&
                    <button className="btn-transparent ml-3"
                        onClick={refreshDevices}>
                        <img width={25} height={25} src={RefreshIcon} alt="refresh-icon" />
                    </button>}
                </h1>
                {loading && 
                <div className="d-flex justify-center">
                    <Loader />
                </div>}
                {!loading && 
                <div>
                    {devices.length === 0 &&
                        <p>
                            No nearby device found. <br/>
                            Try refreshing to scan new devices.
                        </p>}
                    {devices.length > 0 && 
                        <div className="box item-list">
                            {devices.map(deviceName => 
                                <div key={deviceName}>
                                    <p>
                                        <strong>{deviceName}</strong>
                                    </p>
                                    <button className="btn btn-primary ml-3"
                                        onClick={() => handleSendToDevice({
                                            deviceName: deviceName,
                                            })}>Send</button>
                                </div>)}
                        </div>
                    }
                </div>}
            </div>
        </div>
    );
};
