import express from 'express';
import dotenv from 'dotenv';
import auth from './routes/authRoutes';
import { requireAuth } from './middlewares/requireAuth';
import cookieParser from 'cookie-parser';

const port = 8000;
dotenv.config();

// app
const app = express();

// middleware
app.use(express.json());
app.use(cookieParser());

// routes
app.use(auth);
app.get('/', (req, res) => {
  res.status(200).json({endpoint: 'Home'});
});
app.get('/dashboard', requireAuth, (req, res) => {
  res.status(200).json({endpoint: 'Dashboard'});
});

app.listen(8000, () => {
  console.log(`App listening on port http://localhost:${port}`)
});