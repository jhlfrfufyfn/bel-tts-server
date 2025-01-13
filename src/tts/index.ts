import express from 'express';
import { spawn } from 'node:child_process';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';
import axios from 'axios'; // Add axios for HTTP requests

const router = express.Router();

const pathToModel: string = process.env.MODEL_PATH || "/app";
const audioPath: string = process.env.AUDIO_PATH || "/app";
const staticPath: string = process.env.STATIC_PATH || "/app";

function generateRandomString(): string {
  return uuidv4();
}

// defining the home page route
router.get('/', function (request: express.Request, response: express.Response) {
  response.sendFile(path.join(staticPath, 'tts.html'));
});

router.post('/', async function (request: express.Request, response: express.Response) {
    const text: string = request.body.text;

    console.log("text: " + text);

    try {
        // Send request to the phonemizer
        console.log("Sending text to phonemizer...");
        const phonemizerResponse = await axios.post('http://localhost:8080/processText', text, {
          headers: { 'Content-Type': 'text/plain' }
        });
        const phonemizedText: string = phonemizerResponse.data.trim();

        console.log("Phonemized text: " + phonemizedText);

        const filename = generateRandomString() + ".wav";

        const outputPath: string = path.join(audioPath, filename);
        const modelPath: string = path.join(pathToModel, 'model.pth');
        const configPath: string = path.join(pathToModel, 'config.json');
        const vocoderPath: string = path.join(pathToModel, 'vocoder.pth');
        const vocoderConfigPath: string = path.join(pathToModel, 'vocoder-config.json');

        console.log('before gen');

        // Generate audio using the phonemized text
        const generate_audio = spawn('tts', ['--text', phonemizedText, '--model_path', modelPath, '--config_path', configPath, '--vocoder_path', vocoderPath, '--vocoder_config_path', vocoderConfigPath, '--out_path', outputPath]);

        generate_audio.on('error', (error) => {
          console.error('error: ' + error.message);
        });
        generate_audio.stdout.on('data', (data) => {
          console.log('child output: \n' + data);
        });

        generate_audio.stderr.on('data', (data) => {
          console.error('child error: \n' + data);
        });

        generate_audio.on('exit', (code, signal) => {
          console.log('child process exited with ' +
            `code ${code} and signal ${signal}`);
          if (signal === null) {
            console.log('response is sent');
            response.end(JSON.stringify({ audio_name: filename }));
          } else {
            console.error('ERROR');
            response.sendStatus(500);
          }
        });
    } catch (error: any) {
        console.error("Error contacting the phonemizer or generating audio: ", error.message);
        response.status(500).json({ error: "Failed to process text or generate audio" });
    }
});

export default router;
