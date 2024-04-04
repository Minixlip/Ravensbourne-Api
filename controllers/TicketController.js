const Ticket = require('../models/TicketsModel');
const moment = require('moment');
const mongoose = require('mongoose');

const calculateTicketPrice = (dob) => {
  const birthDate = moment(dob, 'YYYY-MM-DD');
  const age = moment().diff(birthDate, 'years');

  if (age >= 18) {
    return 20; // Adult guests (18+ years) pay £20
  } else if (age < 18) {
    return 15; // Guests less than 18 pay £15
  }
};

const CheckTicket = async (req, res) => {
  const {
    userId,
    firstName,
    surName,
    event,
    firstGuestName,
    firstGuestDOB,
    secondGuestName,
    secondGuestDOB,
    guestCount,
  } = req.body;

  try {
    if (!event) {
      throw Error('Event and guest count are required fields');
    }

    const duplicateTicket = await Ticket.findOne({ userId });

    if (duplicateTicket) {
      throw Error(
        'Multiple ticket purchase attemped. Our policy allows only 1 ticket for each user.'
      );
    }

    // Validate guest names
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (firstGuestName && !nameRegex.test(firstGuestName)) {
      throw Error('Invalid first guest name');
    }
    if (secondGuestName && !nameRegex.test(secondGuestName)) {
      throw Error('Invalid second guest name');
    }

    // Validate guest dates of birth
    const isValidDate = (dateString) =>
      moment(dateString, 'YYYY-MM-DD', true).isValid();
    if (firstGuestDOB && !isValidDate(firstGuestDOB)) {
      throw Error('Invalid first guest date of birth');
    }
    if (secondGuestDOB && !isValidDate(secondGuestDOB)) {
      throw Error('Invalid second guest date of birth');
    }

    if (firstGuestDOB) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Adjust month to be 1-based
      const currentDay = currentDate.getDate();

      const [year, month, day] = firstGuestDOB.split('-').map(Number);

      if (year > currentYear) {
        throw new Error('Invalid Birthday, cannot set birthday in the future');
      }
      if (year === currentYear && month > currentMonth) {
        throw new Error('Invalid Birthday, cannot set birthday in the future');
      }
      if (year === currentYear && month === currentMonth && day > currentDay) {
        throw new Error('Invalid Birthday, cannot set birthday in the future');
      }
    }

    if (secondGuestDOB) {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1; // Adjust month to be 1-based
      const currentDay = currentDate.getDate();

      const [year, month, day] = secondGuestDOB.split('-').map(Number);

      if (year > currentYear) {
        throw new Error('Invalid Birthday, cannot set birthday in the future');
      }
      if (year === currentYear && month > currentMonth) {
        throw new Error('Invalid Birthday, cannot set birthday in the future');
      }
      if (year === currentYear && month === currentMonth && day > currentDay) {
        throw new Error('Invalid Birthday, cannot set birthday in the future');
      }
    }

    const guestCountNumber = parseInt(guestCount);

    if (![0, 1, 2].includes(guestCountNumber)) {
      throw Error('Invalid number of guests');
    }

    let ticket;

    if (guestCountNumber === 1) {
      ticket = {
        userId,
        firstName,
        surName,
        event,
        firstGuestName,
        firstGuestDOB,
        guestCount: guestCountNumber,
        totalPrice: 40 + calculateTicketPrice(firstGuestDOB),
      };
    } else if (guestCountNumber === 2) {
      ticket = {
        userId,
        firstName,
        surName,
        event,
        firstGuestName,
        firstGuestDOB,
        secondGuestName,
        secondGuestDOB,
        guestCount: guestCountNumber,
        totalPrice:
          40 +
          calculateTicketPrice(firstGuestDOB) +
          calculateTicketPrice(secondGuestDOB),
      };
    } else if (guestCount === 0) {
      ticket = {
        userId,
        firstName,
        surName,
        event,
        guestCount: guestCountNumber,
        totalPrice: 40,
      };
    }

    const totalAmount = ticket.totalPrice;

    res.status(200).json({ totalAmount, success: true });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const NewTicket = async (req, res) => {
  const {
    userId,
    firstName,
    surName,
    event,
    firstGuestName,
    firstGuestDOB,
    secondGuestName,
    secondGuestDOB,
    guestCount,
  } = req.body;

  try {
    // Convert guest count to a number for comparison
    const guestCountNumber = parseInt(guestCount);

    let ticket;
    if (guestCountNumber === 1) {
      ticket = await Ticket.create({
        userId,
        firstName,
        surName,
        event,
        firstGuestName,
        firstGuestDOB,
        guestCount: guestCountNumber,
        totalPrice: 40 + calculateTicketPrice(firstGuestDOB),
      });
    } else if (guestCountNumber === 2) {
      ticket = await Ticket.create({
        userId,
        firstName,
        surName,
        event,
        firstGuestName,
        firstGuestDOB,
        secondGuestName,
        secondGuestDOB,
        guestCount: guestCountNumber,
        totalPrice:
          40 +
          calculateTicketPrice(firstGuestDOB) +
          calculateTicketPrice(secondGuestDOB),
      });
    } else if (guestCountNumber === 0) {
      ticket = await Ticket.create({
        userId,
        firstName,
        surName,
        event,
        guestCount: guestCountNumber,
        totalPrice: 40,
      });
    }

    res.status(200).json({ ticket });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateTicket = async (req, res) => {
  const { _Id, firstGuestName, secondGuestName } = req.body;

  let newGuestCount = 0;

  // Input validation
  if (!_Id || (!_Id && !firstGuestName && !secondGuestName)) {
    return res.status(400).json({
      error:
        'Invalid request. Please provide a valid ticket ID and at least one guest name.',
    });
  }

  try {
    const ticket = await Ticket.findOne({ _id: _Id }); // Corrected to _id

    if (!ticket) {
      return res.status(404).json({
        error: 'Ticket not found.',
      });
    }

    if (firstGuestName) {
      newGuestCount++;
    }

    if (secondGuestName) {
      newGuestCount++;
    }

    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: _Id }, // Corrected to _id
      { firstGuestName, secondGuestName, guestCount: newGuestCount }
      // return the modified document rather than the original
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error updating ticket:', error);
    res
      .status(500)
      .json({ error: 'An error occurred while updating the ticket.' });
  }
};

module.exports = {
  NewTicket,
  CheckTicket,
  updateTicket,
};
