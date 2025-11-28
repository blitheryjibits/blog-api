import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routers/index.js';
import cors from 'cors';

const app = express();

app.use(cors());  // temporary enable CORS for all origins. Testing purpose only
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router); 

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

export default app;
