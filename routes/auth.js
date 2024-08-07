const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

// run once for create user with hash password

// router.post('/register', async (req, res) => {
//   const { email, password } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ email, password: hashedPassword });
//   await user.save();
//   res.send('User registered');
// });

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists and password matches
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).send('Invalid credentials');
    }

    // Generate a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY); 

    res.send({
      token,
      userId: user._id 
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
});

module.exports = router;
