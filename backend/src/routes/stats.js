import express from 'express';
import auth from '../middleware/auth.js';
import { getSummary, getCategoryBreakdown } from '../controllers/statsController.js';

const router = express.Router();

router.get('/summary', auth, getSummary);
router.get('/category-breakdown', auth, getCategoryBreakdown);

//router.get('/prediction', auth, getExpensePrediction);

export default router;
