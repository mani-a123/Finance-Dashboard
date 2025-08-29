import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import txnRoutes from './routes/transactions.js';
import statsRoutes from './routes/stats.js';

dotenv.config();
const app = express();
import predictionRoutes from "./routes/predictionRoutes.js";





app.use(cors());
app.use(express.json());   // ⬅️ VERY IMPORTANT
app.use(express.urlencoded({ extended: true })); // optional, for form-data

//console.log('✅ DATABASE_URL loaded:', process.env.DATABASE_URL);
// Routes
app.use('/auth', authRoutes);
app.use('/transactions', txnRoutes);
app.use('/stats', statsRoutes);
app.use("/prediction", predictionRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
