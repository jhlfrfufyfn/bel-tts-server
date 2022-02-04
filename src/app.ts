import express from "express";
import compression from "compression";

import sampleRouter from './sample';

const app = express();

app.use(compression());
app.use(express.urlencoded({ extended: true }));

app.use('/sample', sampleRouter);    
export { app };