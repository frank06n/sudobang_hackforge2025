import { Server } from 'socket.io';
import { initSocketServer } from '../sockets/socketHandler.js';

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: '*' },
  });

  initSocketServer(io);
  return io;
};
