import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categories.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

router.get('/', verifyUser, getCategories);
router.post('/', verifyUser, createCategory);
router.put('/:id', verifyUser, updateCategory);
router.delete('/:id', verifyUser, deleteCategory);

export default router;