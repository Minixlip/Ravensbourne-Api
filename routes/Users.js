const express = require('express');

// controller functions
const { createUser, loginUser } = require('../controllers/userController');

const router = express.Router();

// Login route
router.post('/Login', loginUser);

// Register route

router.post('/register', createUser);

module.exports = router;
