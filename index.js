import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import router from './src/routers/index.js';

const app = express();

// ✅ Global CORS handler for Vercel serverless
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

app.get('/', (req, res) => {
  res.send('Welcome to the Blog API!');
});

export default app;


// import dotenv from 'dotenv';
// dotenv.config();
// import express from 'express';
// import router from './src/routers/index.js';
// import cors from 'cors';

// const app = express();

// app.use(cors({
//   origin: 'http://127.0.0.1:5173', // temporary frontend origin for testing.
//   credentials: false,
//   methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
//   allowedHeaders: ['Content-Type','Authorization','Accept'],
//   optionsSuccessStatus: 204
// }));

// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') return res.sendStatus(204);
//   next();
// });

// //app.options('/*', cors()); // ensure preflight handled
//   // temporary enable CORS for all origins. Testing purpose only

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/api', router); 

// app.get('/favicon.ico', (req, res) => res.status(204)); // handle favicon requests
// app.get('/', (req, res) => {
//   res.send('Welcome to the Blog API!');
// });

// export default app;
