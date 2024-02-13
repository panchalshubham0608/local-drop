import React from 'react';
import { useState, useEffect } from 'react';
import './GetStarted.css';

const GetStarted = (props) => {
    const { setDeviceName } = props;
    const [value, setValue] = useState(localStorage.getItem('lastdeviceName') || '');
    const [remember, setRemember] = useState(true);

    // Get deviceName from local storage, if it exists
    useEffect(() => {
        localStorage.removeItem('lastdeviceName');
        let deviceName = localStorage.getItem('deviceName');
        if (deviceName) {
            console.log('setting deviceName to ', deviceName);
            setDeviceName(deviceName);
        }
    }, [setDeviceName]);

    const handleSubmit = () => {
        if (remember) {
            localStorage.setItem('deviceName', value);
        }
        setDeviceName(value);
    };

    return (
        <div className='centered theme-bg theme-size'>
            <div className='box d-flex flex-col'>
                <h1 className='mt-0'>Let's Get Started</h1>
                <div className='text-input-item'>
                    <input
                        type='text'
                        placeholder='Enter your deviceName'
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        autoFocus
                        className='theme-size'
                    />
                </div>
                <button className='btn btn-primary mt-3' onClick={handleSubmit}>
                    Get Started
                </button>
                <div className='mt-3'>
                    <input type='checkbox' id='remember' checked={remember} onChange={(e) => setRemember(e.target.checked)} />
                    <label htmlFor='remember'>Remember me</label>
                </div>
            </div>
        </div>
    );
};

export default GetStarted;
