require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Transaction = require('../models/Transaction');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ MongoDB Connected');

        await User.deleteMany({});
        await Course.deleteMany({});
        await Enrollment.deleteMany({});
        await Transaction.deleteMany({});
        await Certificate.deleteMany({});

        console.log('🧹 Cleared existing data');

        const admin = await User.create({
            name: 'LMS Organization',
            email: 'admin@lms.com',
            password: 'admin123',
            role: 'admin',
            balance: 50000, 
        });

        console.log('✅ Created LMS Organization');

        const instructors = await User.create([
            {
                name: 'John Smith',
                email: 'john@instructor.com',
                password: 'instructor123',
                role: 'instructor',
                bankAccountNumber: 'ACC001',
                secretNumber: 'SECRET001',
            },
            {
                name: 'Sarah Johnson',
                email: 'sarah@instructor.com',
                password: 'instructor123',
                role: 'instructor',
                bankAccountNumber: 'ACC002',
                secretNumber: 'SECRET002',
            },
            {
                name: 'Michael Chen',
                email: 'michael@instructor.com',
                password: 'instructor123',
                role: 'instructor',
                bankAccountNumber: 'ACC003',
                secretNumber: 'SECRET003',
            },
        ]);

        console.log('✅ Created 3 instructors');

        const courses = await Course.create([
            {
                title: 'Web Development Fundamentals',
                description: 'Learn HTML, CSS, and JavaScript from scratch. Build responsive websites and understand modern web development practices.',
                price: 1200,
                instructor: instructors[0]._id,
                category: 'Web Development',
                duration: '6 weeks',
                materials: 'Video lectures, coding exercises, projects, and documentation',
            },
            {
                title: 'Python Programming Masterclass',
                description: 'Master Python programming from basics to advanced topics. Includes data structures, OOP, and real-world projects.',
                price: 1500,
                instructor: instructors[1]._id,
                category: 'Programming',
                duration: '8 weeks',
                materials: 'Interactive coding sessions, assignments, and capstone project',
            },
            {
                title: 'Data Science with Python',
                description: 'Learn data analysis, visualization, and machine learning using Python libraries like Pandas, NumPy, and Scikit-learn.',
                price: 2000,
                instructor: instructors[0]._id,
                category: 'Data Science',
                duration: '10 weeks',
                materials: 'Jupyter notebooks, datasets, video tutorials, and research papers',
            },
            {
                title: 'Mobile App Development',
                description: 'Build cross-platform mobile applications using React Native. Create beautiful and functional mobile apps.',
                price: 1800,
                instructor: instructors[2]._id,
                category: 'Mobile Development',
                duration: '8 weeks',
                materials: 'Code templates, design resources, and step-by-step guides',
            },
            {
                title: 'Digital Marketing Essentials',
                description: 'Learn SEO, social media marketing, content creation, and analytics. Grow your online presence effectively.',
                price: 1000,
                instructor: instructors[1]._id,
                category: 'Marketing',
                duration: '4 weeks',
                materials: 'Case studies, marketing tools, templates, and live sessions',
            },
        ]);

        console.log('✅ Created 5 courses');

        console.log('\n📊 Seed Data Summary:');
        console.log('-----------------------------------');
        console.log(`Admin: ${admin.email} / admin123`);
        instructors.forEach((instructor, index) => {
            console.log(`Instructor ${index + 1}: ${instructor.email} / instructor123`);
        });
        console.log('\nTest Learner Credentials:');
        console.log('Email: learner@test.com');
        console.log('Password: learner123');
        console.log('Bank Account: ACC999');
        console.log('Secret Number: SECRET999');
        console.log('-----------------------------------');

        await User.create({
            name: 'Test Learner',
            email: 'learner@test.com',
            password: 'learner123',
            role: 'learner',
            bankAccountNumber: 'ACC999',
            secretNumber: 'SECRET999',
            balance: 15000,
        });

        console.log('✅ Created test learner account');
        console.log('\n✨ Seed data created successfully!\n');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
