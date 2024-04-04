const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cardsSchema = new Schema(
  {
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    cardFullName: {
      type: String,
      required: true,
    },
    cardExpiryDay: {
      type: String,
      required: true,
    },
    cardExpiryYear: {
      type: String,
      required: true,
    },
    cardCVC: {
      type: String,
      required: true,
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cards', cardsSchema);
