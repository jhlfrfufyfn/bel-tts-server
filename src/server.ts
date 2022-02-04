import http from 'node:http';
import { app } from './app';

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';

// Create HTTP server.
const server = http.createServer(app);
server.listen(port);
console.log(`Listening on port ${port}`);