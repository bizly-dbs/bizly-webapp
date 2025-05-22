import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.js';

const router = express.Router();

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

export default router;