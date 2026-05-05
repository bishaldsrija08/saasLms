import express from 'express';
const app = express();

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
import authRoutes from "./routes/globals/auth/auth.routes";
import instituteRoutes from "./routes/institute/instituteRoutes";

app.use("/api/institute", instituteRoutes)
app.use("/api", authRoutes)









export default app;