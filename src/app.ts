import express from "express";
import compression from "compression";
import cors from 'cors';


import ttsRouter from './tts';

const app = express();

app.use(express.static(process.env.STATIC_PATH || "static"));
app.use(express.static(process.env.AUDIO_PATH || 'audio'));

app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/tts', ttsRouter);    

export { app };