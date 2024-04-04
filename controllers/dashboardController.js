const User = require('../models/UsersModel');
const Ticket = require('../models/TicketsModel');
const mongoose = require('mongoose');

const fetchUser = async (req, res) => {
  try {
    const { id } = req.params; // Assuming the user ID is passed as a route parameter

    console.log(id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: 'No such user' });
    }

    // Fetch user from the database
    const user = await User.findById(id);
    const ticket = await Ticket.find({ userId: id });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (ticket.length === 0) {
      return res.json({ user, ticket: 'No ticket found' });
    }

    res.json({ user, ticket: ticket[0] }); // Return the user as JSON response
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  fetchUser,
};
