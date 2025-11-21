import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routers/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router); 

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

export default app;
