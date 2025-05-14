const express = require('express');
const app = express();

app.use(express.json());

// Routes
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required!");
    }
})