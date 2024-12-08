import express from 'express';
import jwt from 'jsonwebtoken';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import compression from 'compression';
import cors from 'cors';
import { JWT_SECRET, PORT } from './config'
import router from './router';

const app = express();

app.use(cors({
  credentials: true,
  origin: 'http://localhost:4200'
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/', router());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});