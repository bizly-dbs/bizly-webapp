import express from 'express';
import { analyzeBusiness, predictSales } from '../controllers/ml.js';
import { verifyUser } from '../middlewares/authUser.js';

const router = express.Router();

router.post('/analyze', verifyUser, analyzeBusiness);
router.post('/predict', verifyUser, predictSales);

export default router;