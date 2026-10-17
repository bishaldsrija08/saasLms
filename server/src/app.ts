import express from 'express';
const app = express();

// Body parser middleware
app.use(express.json());


import authRoutes from './routes/auth/auth.route';
import instituteRoutes from './routes/institute/institute.routes';
// Routes
app.use('/api', authRoutes);
app.use('/api/institute', instituteRoutes);










export default app;