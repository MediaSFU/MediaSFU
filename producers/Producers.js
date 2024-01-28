// Producers.js is a file that contains all the producers that are used to send media to the server. 
//The producers are functions that take in a socket and return a function that takes in a media stream and sends it to the server. 

import { connectSocket,disconnectSocket } from "../sockets/SocketManager";