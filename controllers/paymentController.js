const Card = require('../models/CardsModel');

const Payment = async (req, res) => {
  const {
    cardNumber,
    cardFullName,
    cardExpiryDate,
    cardCVC,
    totalPrice,
    userId,
  } = req.body;
};

module.exports = {
  Payment,
};
