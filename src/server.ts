import http from 'node:http';
import https from 'node:https';
import fs from 'fs';
import { app } from './app';

// Get port from environment and store in Express.
const port = process.env.PORT || '3000';
// Create HTTP server.
const server = http.createServer(app);
server.listen(port)
console.log(`HTTP server listening on port ${port}`);


// Get port from environment and store in Express.
/*
if (process.env.NODE_ENV === "production") {
    const securePort = process.env.SECURE_PORT || '3433';

    const secretKeyPath = process.env.SECRET_KEY_PATH || "sslcert/server.key";
    const certificatePath = process.env.CERTIFICATE_PATH || "sslcert/server.crt";

    const privateKey = fs.readFileSync(secretKeyPath, 'utf8');
    const certificate = fs.readFileSync(certificatePath, 'utf8');

    const credentials = { key: privateKey, cert: certificate };

    // Create HTTPS server.
    const https_server = https.createServer(credentials, app);
    https_server.listen(securePort)
    console.log(`HTTPS server listening on port ${securePort}`);
}
*/