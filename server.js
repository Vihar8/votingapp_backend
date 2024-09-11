const express = require ("express"); // Import Express framework
const app = express(); // Create an instance of Express
const db = require('./db');
require('dotenv').config();

// Middleware to parse JSON data in the request body
const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body me store karega data // This will parse JSON payloads in incoming requests and make it available in req.body
const PORT = process.env.PORT || 3000;

// routes files import
const userRoutes = require('./routes/userRoutes'); // Import routes related to 'person' (ensure the file exists)
const candidateRoutes = require("./routes/candidateRoutes");


// Register the imported routes
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes)


// Start the server on port 3000
app.listen(PORT, () => {
    console.log(`server is on 3000`);
        
})