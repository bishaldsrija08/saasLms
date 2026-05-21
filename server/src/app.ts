import express from 'express';
const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from "./routes/globals/auth/auth.routes";
import instituteRoutes from "./routes/institute/instituteRoutes";
import courseRoutes from './routes/institute/course/courseRoutes';


app.use("/api/institute", instituteRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/institute/course", courseRoutes)








export default app;