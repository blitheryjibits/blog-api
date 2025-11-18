import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from "@vendia/serverless-express";
import router from './src/routers/index.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', router)

export default createServer(app);
