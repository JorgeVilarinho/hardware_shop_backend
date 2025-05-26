import express from 'express';
import http from 'http';
import https from 'https';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import compression from 'compression';
import cors from 'cors';
import fs from 'fs';
import { PORT, PROD } from './config.js'
import router from './router/index.js';

const app = express();

let origin: string[]

if(PROD === 'true') {
  origin = [ 'http://byteshop.gg', 'http://www.byteshop.gg', 'https://byteshop.gg', 'https://www.byteshop.gg' ]
} else {
  origin = [ 'http://localhost:4200' ]
}

app.use(cors({
  credentials: true,
  origin
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', router());

if(PROD === 'true') {
  const options = {
    key: fs.readFileSync('/etc/nginx/ssl/backend-byteshop.key'),
    cert: fs.readFileSync('/etc/nginx/ssl/backend-byteshop.crt'),
  }

  const server = https.createServer(options, app);

  server.listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
  });
} else {
  const server = http.createServer(app);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}