const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

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
        res.status(200).send('Login successful!');
    }
    catch (error) {
        console.error(error);
        res.status(500).send('Server error!');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})