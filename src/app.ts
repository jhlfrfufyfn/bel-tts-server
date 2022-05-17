import express from "express";
import compression from "compression";
import cors from 'cors';
import path from 'node:path';

import ttsRouter from './tts';

const staticPath: string = process.env.STATIC_PATH || "/app";

const app = express();

app.use(express.static(process.env.STATIC_PATH || "static"));
app.use(express.static(process.env.AUDIO_PATH || 'audio'));

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.all('/', (req, res) => {
    res.redirect("/tts");
})

app.get('/nan', (req, res) => {
    res.redirect('https://corpus.by/TextToSpeechSynthesizer/');
})

app.get('/examples', (req, res) => {
    res.sendFile(path.join(staticPath, 'examples.html'));
})
app.use('/tts', ttsRouter);    

export { app };