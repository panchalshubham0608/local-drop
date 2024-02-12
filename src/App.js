import React, { useEffect, useCallback } from 'react';
import { useState } from 'react';
import './App.css';
import Connecting from './components/Connecting/Connecting';
import GetStarted from './components/GetStarted/GetStarted';
import FileChooser from './components/FileChooser/FileChooser';
import socket from './socket';

function App() {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState([]);
  const [connected, setConnected] = useState(false);

  const handleChangeUsername = useCallback(() => {
    console.log('clearing up...');
    localStorage.removeItem('username');
    localStorage.setItem('lastUsername', username);
    setUsername('');
  }, [username]);
  
  useEffect(() => {
    socket.connect();
  }, []);

  const onConnect = useCallback(() => {
    console.log('now username= ', username);
    setConnected(true);
    socket.emit('username', { username });
  }, [setConnected, username]);

  const onDisconnect = useCallback(() => {
    setConnected(false);
    window.location.reload();
  }, [setConnected]);

  useEffect(() => {
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [onConnect, onDisconnect]);

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
        </div>
      }
    </div>
  );
}

export default App;
