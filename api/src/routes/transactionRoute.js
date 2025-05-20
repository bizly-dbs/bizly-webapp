import express from 'express';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction, filterTransactions, searchTransactions, transactionSummary } from '../controllers/transactions.js';
import { validateDateRange } from '../middlewares/validateDate.js';
import { validateSearchInput } from '../middlewares/validateKeyword.js';

const router = express.Router();

router.get('/transactions', getTransactions);
router.post('/transactions', createTransaction);
router.put('/transactions/:id', updateTransaction);
router.delete('/transactions/:id', deleteTransaction);
router.get('/transactions/filter', validateDateRange, filterTransactions)
router.get('/transactions/search', validateSearchInput, searchTransactions)
router.get('/transactions/summary', transactionSummary)

export default router;