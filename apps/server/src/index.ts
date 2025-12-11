import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import authRouter from './routes/auth.js';
import booksRouter from './routes/books.js';

const app = express();
const httpServer = createServer(app);
const io = new SocketIOServer(httpServer, { cors: { origin: '*' } });

app.use(cors({ origin: true, credentials: true }));
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '2mb' }));
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'bookverse-api' });
});

app.use('/api/auth', authRouter);
app.use('/api/books', booksRouter);

io.on('connection', (socket) => {
  socket.emit('welcome', { message: 'Connected to BookVerse realtime' });
});

async function start() {
  const mongo = env.mongoUri;
  if (mongo) {
    await mongoose.connect(mongo);
    console.log('MongoDB connected');
  } else {
    console.warn('MONGODB_URI not set, starting without DB connection');
  }

  httpServer.listen(env.port, () => {
    console.log('Server listening on port', env.port);
  });
}

start().catch((err) => {
  console.error('Fatal start error', err);
  process.exit(1);
});
