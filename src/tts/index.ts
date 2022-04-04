import express from 'express';
import { spawn } from 'node:child_process';
import { v4 as uuidv4 } from 'uuid';
import path from 'node:path';
const router = express.Router();

const model_path: string = process.env.MODEL_PATH || "model.pth.tar";
const config_path: string = process.env.CONFIG_PATH || "config.json";
const audio_path: string = process.env.AUDIO_PATH || "audio";
const static_path: string = process.env.STATIC_PATH || "static";
// define the home page route
router.get('/', function (request: express.Request, response: express.Response) {
  response.sendFile(path.join(static_path, 'tts.html'));
});

router.post('/', function (request: express.Request, response: express.Response) {
    const text: string = request.body.text;
    console.log("text: " + text);
    const filename = uuidv4() + ".wav";
    const output_path: string = path.join(audio_path, filename);
    console.log('before gen');
    const generate_audio = spawn('tts', ['--text', text, '--model_path', model_path, '--config_path', config_path, '--out_path', output_path]);

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
        response.end(JSON.stringify({audio_name: filename}));
      }
      else {
        console.error('ERROR');
        response.sendStatus(500);
      }
    });
  });

export default router;