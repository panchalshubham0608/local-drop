import React, { useEffect } from 'react';
import { useState } from 'react';
import './App.css';
import GetStarted from './components/GetStarted/GetStarted';
import FileChooser from './components/FileChooser/FileChooser';

function App() {
  const [username, setUsername] = useState('');

  return (
    <div className="App">
      {!username && <GetStarted setUsername={setUsername} />}
      {username && <FileChooser username={username} />}
    </div>
  );
}

export default App;
