const express = require('express');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');

console.log(__dirname)
const app = express();

//middlewares
app.use(express.json());
app.use(cors()); // use to allow communicate with frontend

// routes redirect
app.use('/auth', authRoutes);
app.use('/products', productRoutes);

//use the client app
app.use(express.static(path.join(__dirname, '/client/build')))

//render client for any path 
app.get('*', (req, res) => res.sendFile((path.join(__dirname, '/client/build/index.html'))));
app.post('*', (req, res) => res.sendFile((path.join(__dirname, '/client/build/index.html'))));
// Connect to the database
connectDB();




app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
