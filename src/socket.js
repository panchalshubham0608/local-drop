import { io } from 'socket.io-client';
import { baseUrl } from './util';

const socket = io(baseUrl, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 10,    
});

export default socket;
