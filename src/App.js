import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import './App.css';
import Connecting from './components/Connecting/Connecting';
import GetStarted from './components/GetStarted/GetStarted';
import FileChooser from './components/FileChooser/FileChooser';
import socket from './socket';
import DeviceChooser from './components/DeviceChooser/DeviceChooser';
import axios from 'axios';
import FileTransfer from './components/FileTransfer/FileTransfer';

function App() {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState([]);
  const [connected, setConnected] = useState(false);
  const [uploadState, setUploadState] = useState({
    targetDeviceName: '',
    targetDeviceId: '',
    uploading: false,
    tokenSource: axios.CancelToken.source(),
  });

  const handleChangeUsername = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.setItem('lastUsername', username);
    setUsername('');
  }, [username]);

  const handleSendToDevice = ({deviceId, deviceName}) => {
    setUploadState(uploadState => {
      return {
        ...uploadState,
        targetDeviceName: deviceName,
        targetDeviceId: deviceId,
        uploading: true,
      }
    });
    // socket.emit('transfer_request', {deviceId, filesCount: files.length});
  };

  const cancelUpload = useCallback(() => {
    // cancel all ongoing requests
    uploadState.tokenSource.cancel();
    // refresh everything
    setUploadState({
      targetDeviceName: '',
      targetDeviceId: '',
      uploading: false,
      tokenSource: axios.CancelToken.source(),
    });
  }, [uploadState, setUploadState]);

  // make a connection on start-up
  useEffect(() => {
    socket.connect();
    return () => {
      // socket.disconnect();
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

  const onClientDisconnected = useCallback(() => {
    alert(`Client ${uploadState.targetDeviceName} is unavailable!`);
    cancelUpload();
  }, [cancelUpload, uploadState]);

  const onTransferRequest = useCallback(({deviceId, deviceName, filesCount}) => {
    let accepted = window.confirm(`Accept ${filesCount} files from ${deviceName}?`);
    socket.emit('transfer_response', {deviceId, accepted});
  }, []);

  const onTransferResponse = useCallback(({accepted}) => {
    if (!accepted) {
      alert(`Your transfer request was rejected by ${uploadState.targetDeviceName}!`);
      cancelUpload();
      return;
    }
    setUploadState(uploadState => {
      return {
        ...uploadState,
        uploading: true,
      }
    });
  }, [uploadState, cancelUpload]);

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
  useEffect(() => {
    socket.on('client_disconnected', onClientDisconnected);
    return () => { socket.off('client_disconnected', onClientDisconnected); }
  });
  useEffect(() => {
    socket.on('transfer_request', onTransferRequest);
    return () => { socket.off('transfer_request', onTransferRequest); }
  });
  useEffect(() => {
    socket.on('transfer_response', onTransferResponse);
    return () => { socket.off('transfer_response', onTransferResponse); }
  });

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
          {(!uploadState.targetDeviceName) && 
            <DeviceChooser thisDeviceName={username} handleSendToDevice={handleSendToDevice} />}
          {uploadState.targetDeviceName && <FileTransfer uploadState={uploadState} files={files} />}
        </div>
      }
    </div>
  );
}

export default App;
