import React from 'react';
import { useState } from 'react';
import './App.css';
import GetStarted from './components/GetStarted/GetStarted';
import FileChooser from './components/FileChooser/FileChooser';

function App() {
  const [username, setUsername] = useState('');
  const [files, setFiles] = useState([]);

  return (
    <div className="App">
      {!username && <GetStarted setUsername={setUsername} />}
      {(!files || files.length === 0) && <FileChooser username={username} setUsername={setUsername} setFiles={setFiles} />}
    </div>
  );
}

export default App;
