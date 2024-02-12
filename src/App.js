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
  const [transferState, settransferState] = useState({
    targetDeviceName: '',
    uploading: false,
    downloading: false,
    tokenSource: axios.CancelToken.source(),
  });

  const handleChangeUsername = useCallback(() => {
    localStorage.removeItem('username');
    localStorage.setItem('lastUsername', username);
    setUsername('');
  }, [username]);

  const handleSendToDevice = ({deviceName}) => {
    settransferState(transferState => {
      return {
        ...transferState,
        targetDeviceName: deviceName,
        uploading: false,  
        downloading: false,      
      }
    });
    socket.emit('transfer_request', {deviceName, files: files.map(file => file.name)});
  };

  const cancelUploadDownload = useCallback(() => {
    // cancel all ongoing requests
    transferState.tokenSource.cancel();
    // refresh everything
    settransferState({
      targetDeviceName: '',
      uploading: false,
      downloading: false,
      tokenSource: axios.CancelToken.source(),
    });
  }, [transferState, settransferState]);

  const handleIndividualFileTransferred = useCallback((file) => {
    if (file) {
      socket.emit('file_ready', {deviceName: transferState.targetDeviceName, file});
    }
  }, [transferState.targetDeviceName]);

  // make a connection on start-up
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
    transferState.tokenSource.cancel();
    window.location.reload();
  }, [setConnected, transferState]);

  const onDuplicate = useCallback(() => {
    alert(`User ${username} is already connected!`);
    handleChangeUsername();
  }, [username, handleChangeUsername]);

  const onClientDisconnected = useCallback(() => {
    alert(`Client ${transferState.targetDeviceName} is unavailable!`);
    cancelUploadDownload();
  }, [cancelUploadDownload, transferState]);

  const onTransferRequest = useCallback(({deviceName, files}) => {
    let filesCount = files.length;
    let accepted = window.confirm(`Accept ${filesCount} files from ${deviceName}?`);
    socket.emit('transfer_response', {deviceName, accepted});
    if (accepted) {
      setFiles(files);
      settransferState(transferState => {
        return {
          ...transferState,
          targetDeviceName: deviceName,
          uploading: false,
          downloading: true,
        }
      });
    }
  }, []);

  const onTransferResponse = useCallback(({accepted}) => {
    if (!accepted) {
      alert(`Your transfer request was rejected by ${transferState.targetDeviceName}!`);
      cancelUploadDownload();
      return;
    }
    settransferState(transferState => {
      return {
        ...transferState,
        uploading: true,
      }
    });
  }, [transferState, cancelUploadDownload]);

  // const onFileReady = useCallback((file) => {

  // }, []);

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
          {(!transferState.targetDeviceName) && 
            <DeviceChooser thisDeviceName={username} handleSendToDevice={handleSendToDevice} />}
          {transferState.targetDeviceName &&
            <FileTransfer
              transferState={transferState}
              files={files}
              handleIndividualFileTransferred={handleIndividualFileTransferred}/>}
        </div>
      }
    </div>
  );
}

export default App;
