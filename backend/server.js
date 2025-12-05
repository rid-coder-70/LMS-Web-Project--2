require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const transactionRoutes = require('./routes/transactions');
const certificateRoutes = require('./routes/certificates');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to LMS API',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            courses: '/api/courses',
            enrollments: '/api/enrollments',
            transactions: '/api/transactions',
            certificates: '/api/certificates',
        },
    });
});

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/certificates', certificateRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📡 API URL: http://localhost:${PORT}`);
    console.log(`📚 Documentation: http://localhost:${PORT}\n`);
});
