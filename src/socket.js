import { io } from 'socket.io-client';

const url = "http://localhost:8080";
const socket = io(url, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,    
});

export default socket;
