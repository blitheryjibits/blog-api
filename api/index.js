import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import router from '../src/routers/index.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});

