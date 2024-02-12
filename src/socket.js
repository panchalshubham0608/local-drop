import { io } from 'socket.io-client';

const url = "http://localhost:8080";
const socket = io(url, {
    autoConnect: false,
    forceNew: true,
});

export default socket;
