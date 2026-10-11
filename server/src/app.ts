import express from 'express';
const app = express();

// Body parser middleware
app.use(express.json());


import authRoutes from './routes/auth/auth.route';
// Routes
app.use('/api', authRoutes);










export default app;