const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());

// Routes
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send("Email and password are required!");
    }

    res.status(200).send("Credentials received, checking...");
})

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})