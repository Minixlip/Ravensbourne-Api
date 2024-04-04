const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ticketsSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    event: {
      type: String,
      required: true,
      uppercase: true,
    },
    firstName: {
      type: String,
      required: true,
      uppercase: true,
    },
    surName: {
      type: String,
      required: true,
      uppercase: true,
    },
    guestCount: {
      type: String,
      required: true,
    },
    firstGuestName: {
      type: String,
      required: false,
      uppercase: true,
    },
    firstGuestDOB: {
      type: String,
      required: false,
    },
    secondGuestName: {
      type: String,
      required: false,
      uppercase: true,
    },
    secondGuestDOB: {
      type: String,
      required: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketsSchema);
