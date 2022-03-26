import http from 'node:http';
import https from 'node:https';
import { app } from './app';

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
const secure_port = process.env.SECURE_PORT || '433';

// Create HTTP server.
const server = http.createServer(app);
server.listen(port)
console.log(`HTTP server listening on port ${port}`);

// Create HTTPS server.
const https_server = https.createServer(app);
https_server.listen(secure_port)
console.log(`HTTPS server listening on port ${secure_port}`);