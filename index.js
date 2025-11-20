import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from "@vendia/serverless-express";
import router from './src/routers/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// in index.js or api entry
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get('/favicon.png', (req, res) => res.status(204).end());

app.use('/', router)
router.get('/ping', (req, res) => {
  res.send('API is running ...');
});

// export default createServer(app);

const handler = createServer(app);

export default function (req, res) {
  return handler(req, res);
}
