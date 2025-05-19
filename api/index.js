require('dotenv').config();
const express = require('express');
const authRoute = require('./routes/authRoute');
const categoriesRoute = require('./routes/categoriesRoute');
const transactionRoute = require('./routes/transactionRoute');
const userRoute = require('./routes/userRoute');

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