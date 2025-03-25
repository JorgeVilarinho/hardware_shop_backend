import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser'
import compression from 'compression';
import cors from 'cors';
import { PORT } from './config.js'
import router from './router/index.js';

const app = express();

app.use(cors({
  credentials: true,
  origin: [ 'http://byteshop.com', 'http://www.byteshop.com' ]
}));

app.use(compression());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

app.use('/', router());

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});