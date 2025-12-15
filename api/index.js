import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from '../src/routers/index.js';
import serverless from 'serverless-http';

const app = express();

// ✅ Global CORS for Vercel serverless
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/favicon.ico', (req, res) => res.status(204).end());

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

// ✅ Export serverless handler
export default serverless(app);
