import express from 'express';
import auth from '../middleware/auth.js';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
} from '../controllers/txnController.js';

const router = express.Router();

router.post('/', auth, createTransaction);
router.get('/', auth, getTransactions);
router.put('/:id', auth, updateTransaction);
router.delete('/:id', auth, deleteTransaction);

export default router;
