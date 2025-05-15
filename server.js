const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/userdetails', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB!'))
.catch((err) => console.log('Error connecting to MongoDB', err));

// Routes
// -- Existing user logging in --
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required!");
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('User not found!');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Invalid credentials!');
        }

        const payload = { email: user.email };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

        res.status(200).json({
            message: 'Login Successful!',
            data: token
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error!');
    }
});

// -- Registering users --
app.post('/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send('Email and password are required!');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already exists!');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).send('User registered successfully!');
    }
    
    catch (error) {
        console.log(error);
        res.status(500).send('Server error!');
    }
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})