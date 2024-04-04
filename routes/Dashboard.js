const express = require('express');

const { updateTicket } = require('../controllers/TicketController');
const { fetchUser } = require('../controllers/dashboardController');
const requireAuth = require('../middleware/requireAuth');

const router = express.Router();
router.use(requireAuth);
// UPDATE updated ticket
router.patch('/ticket/update', updateTicket);

// get a single user
router.get('/profile/:id', fetchUser);

module.exports = router;
