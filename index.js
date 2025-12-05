import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routers/index.js';
import cors from 'cors';

const app = express();

app.use(cors({
  origin: 'http://127.0.0.1:5173', // temporary frontend origin for testing.
  credentials: false,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  optionsSuccessStatus: 204
}));

app.use((req, res, next) => {
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router); 

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

export default app;
