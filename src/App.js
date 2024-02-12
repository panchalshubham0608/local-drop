import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import './App.css';
import Connecting from './components/Connecting/Connecting';
import GetStarted from './components/GetStarted/GetStarted';
import FileChooser from './components/FileChooser/FileChooser';
import socket from './socket';
import DeviceChooser from './components/DeviceChooser/DeviceChooser';

function App() {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState(['x', 'y']);
  const [connected, setConnected] = useState(true);

  const handleChangeUsername = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.setItem('lastUsername', username);
    setUsername('');
  }, [username]);

  const handleSendToDevice = (deviceId) => {
    console.log('sending files to ' + deviceId);
  };

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    }
  }, []);

  const onConnect = useCallback(() => {
    setConnected(true);
  }, [setConnected]);

  const onDisconnect = useCallback(() => {
    setConnected(false);
    window.location.reload();
  }, [setConnected]);

  const onDuplicate = useCallback(() => {
    alert(`User ${username} is already connected!`);
    handleChangeUsername();
  }, [username, handleChangeUsername]);

  // whenever username changes, send an event to the server to notify
  useEffect(() => {
    if (connected && username) {
      socket.emit('username', { username });
    }
  }, [connected, username]);

  // register dependencies
  useEffect(() => {
    socket.on('connect', onConnect);
    return () => { socket.off('connect', onConnect)};
  }, [onConnect]);
  useEffect(() => {
    socket.on('disconnect', onDisconnect);
    return () => { socket.off('disconnect', onDisconnect)};
  }, [onDisconnect]);
  useEffect(() => {
    socket.on('duplicate', onDuplicate);
    return () => { socket.off('duplicate', onDuplicate)};
  }, [onDuplicate]);

  return (
    <div className="App">
      {
        !connected &&
        <Connecting />
      }
      {
        connected && 
        <div>
          {!username && <GetStarted setUsername={setUsername} />}
          {(!files || files.length === 0) &&
            <FileChooser username={username} handleChangeUsername={handleChangeUsername} setFiles={setFiles} />}
          {(files && files.length > 0) && 
            <DeviceChooser thisDeviceName={username} handleSendToDevice={handleSendToDevice} />}
        </div>
      }
    </div>
  );
}

export default App;
