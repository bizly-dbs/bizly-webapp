import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import authRoute from './src/routes/authRoute.js';
import categoriesRoute from './src/routes/categoriesRoute.js';
import transactionRoute from './src/routes/transactionRoute.js';
import userRoute from './src/routes/userRoute.js';
import transactionProductRoute from './src/routes/transactionProductRoute.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// routes
app.use('/auth', authRoute)
app.use('/categories', categoriesRoute)
app.use('/transactions', transactionRoute)
app.use('/users', userRoute)
app.use('/transactions-products', transactionProductRoute)