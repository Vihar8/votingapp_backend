const mongoose = require('mongoose');
require('dotenv').config();
     const mongoURL = 'mongodb://localhost:27017/voting';
    // const mongoURL = process.env.MONGODB_URL;

//setup mongodb connection
mongoose.connect(mongoURL, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
});

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Connected to MongoDB'); 
});

db.on('error', (err) => {
    console.log('MongoDB connection error');  
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});  