import express from 'express';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
import { PORT } from './config.js'
import router from './router/index.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: [ 'http://byteshop.com', 'http://www.byteshop.com', 'https://byteshop.com', 'https://www.byteshop.com' ]
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', router());

const options = {
  key: fs.readFileSync('/etc/nginx/ssl/backend-byteshop.key'),
  cert: fs.readFileSync('/etc/nginx/ssl/backend-byteshop.crt'),
}

// const server = http.createServer(app);

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Server running on https://localhost:${PORT}`);
});