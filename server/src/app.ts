import express from 'express';
import dotenv from 'dotenv';
import cors, { CorsOptions } from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import jobRoutes from './routes/jobRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Connect to the database
connectDB();

// Middleware to parse JSON bodies with a larger limit
app.use(express.json({ limit: '10mb' })); // Adjust the limit as necessary
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000', // Add any other origins you want to allow
  'http://localhost:8000'
];

const corsOptions: CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
