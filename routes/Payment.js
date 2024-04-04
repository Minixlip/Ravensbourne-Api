const express = require('express');

const { NewTicket, CheckTicket } = require('../controllers/TicketController');
const { CheckCards } = require('../controllers/CardController');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

// authentication
router.use(requireAuth);

// Payment Route
router.post('/Payment', CheckCards);

// Ticket Route
router.post('/Ticket', NewTicket);

// Ticket Check Route
router.post('/Ticket/check', CheckTicket);

module.exports = router;
