import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routers/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router)

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
