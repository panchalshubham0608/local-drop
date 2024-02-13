import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import Connecting from './components/Connecting/Connecting';
import GetStarted from './components/GetStarted/GetStarted';
import FileChooser from './components/FileChooser/FileChooser';
import DeviceChooser from './components/DeviceChooser/DeviceChooser';
import FileTransfer from './components/FileTransfer/FileTransfer';
import socket from './socket';
import axios from 'axios';
import './App.css';

function App() {
  const [deviceName, setDeviceName] = useState('');
  const [files, setFiles] = useState([]);
  const [connected, setConnected] = useState(false);
  const [transferState, setTransferState] = useState({
    targetDeviceName: '',
    status: '',
    tokenSource: axios.CancelToken.source(),
  });

  const handleChangedeviceName = useCallback(() => {
    localStorage.removeItem('deviceName');
    localStorage.setItem('lastdeviceName', deviceName);
    setDeviceName('');
  }, [deviceName]);

  const handleSendToDevice = ({deviceName}) => {
    setTransferState(transferState => {
      return {
        ...transferState,
        targetDeviceName: deviceName,
        status: 'waiting_approval',
      }
    });
    socket.emit('transfer_request', {
      toDeviceName: deviceName,
      files: files.map(file => {
        return { name: file.name };
      })
    });
  };

  const cancelTransfer = useCallback(() => {
    // cancel all ongoing requests
    transferState.tokenSource.cancel();
    // refresh everything
    if (transferState.status === 'downloading') {
      setFiles([]);
    }
    setTransferState({
      targetDeviceName: '',
      status: '',
      tokenSource: axios.CancelToken.source(),
    });
  }, [transferState, setTransferState]);

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
    cancelTransfer();
    window.location.reload();
  }, [setConnected, cancelTransfer]);

  const onDuplicate = useCallback(() => {
    alert(`User ${deviceName} is already connected!`);
    handleChangedeviceName();
  }, [deviceName, handleChangedeviceName]);

  const onClientDisconnected = useCallback(() => {
    if (transferState.targetDeviceName) {
      alert(`Client ${transferState.targetDeviceName} is unavailable!`);
    }
    cancelTransfer();
  }, [cancelTransfer, transferState]);

  const onTransferRequest = useCallback(({ fromDeviceName, files }) => {
    let filesCount = files.length;
    let accepted = window.confirm(`Accept ${filesCount} files from ${fromDeviceName}?`);
    socket.emit('transfer_response', { toDeviceName: fromDeviceName, accepted });
    if (accepted) {
      setFiles(files);
      setTransferState(transferState => {
        return {
          ...transferState,
          targetDeviceName: fromDeviceName,
          status: 'downloading',
        }
      });
    }
  }, []);

  const onTransferResponse = useCallback(({ accepted, fromDeviceName }) => {
    if (!accepted) {
      alert(`Your transfer request was rejected by ${fromDeviceName}!`);
      cancelTransfer();
      return;
    }
    setTransferState(transferState => {
      return {
        ...transferState,
        status: 'uploading',
      }
    });
  }, [cancelTransfer]);

  // const onFileReady = useCallback((file) => {

  // }, []);

  // whenever deviceName changes, send an event to the server to notify
  useEffect(() => {
    if (connected && deviceName) {
      socket.emit('deviceName', { deviceName });
    }
  }, [connected, deviceName]);

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
          {!deviceName && <GetStarted setDeviceName={setDeviceName} />}
          {(!files || files.length === 0) &&
            <FileChooser deviceName={deviceName} handleChangedeviceName={handleChangedeviceName} setFiles={setFiles} />}
          {(!transferState.targetDeviceName) && 
            <DeviceChooser thisDeviceName={deviceName} handleSendToDevice={handleSendToDevice} />}
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
