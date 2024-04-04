const express = require('express');
const router = express.Router();

const { createCards } = require('../controllers/CardController');

router.post('/card', createCards);

module.exports = router;
