const Card = require('../models/CardsModel');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const createCards = async (req, res) => {
  const {
    cardNumber,
    cardFullName,
    cardExpiryDay,
    cardExpiryYear,
    cardCVC,
    balance,
  } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const hash1 = await bcrypt.hash(cardFullName, salt);
    const hash2 = await bcrypt.hash(cardCVC, salt);
    const hash3 = await bcrypt.hash(cardExpiryDay, salt);
    const hash4 = await bcrypt.hash(cardExpiryYear, salt);

    // add doc to DB
    const card = await Card.create({
      cardNumber,
      cardFullName: hash1,
      cardCVC: hash2,
      cardExpiryDay: hash3,
      cardExpiryYear: hash4,
      balance,
    });

    res.status(200).json({ card });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const CheckCards = async (req, res) => {
  const {
    cardNumber,
    cardFullName,
    cardExpiryDay,
    cardExpiryYear,
    cardCVC,
    totalPrice,
  } = req.body;

  try {
    if (cardNumber.length !== 16) {
      throw Error('Card number invalid, please input a 16digit card number.');
    }

    const card = await Card.findOne({ cardNumber });

    if (!card) {
      throw Error('Card not found, please try again');
    }

    const match1 = await bcrypt.compare(cardFullName, card.cardFullName);
    if (match1) {
      const match2 = await bcrypt.compare(cardExpiryDay, card.cardExpiryDay);
      if (match2) {
        const match3 = await bcrypt.compare(
          cardExpiryYear,
          card.cardExpiryYear
        );
        if (match3) {
          const match4 = await bcrypt.compare(cardCVC, card.cardCVC);
          if (!match4) {
            throw Error('Card found, but CVC does not match');
          }
        } else {
          throw Error('Card found, but Expiry Year does not match');
        }
      } else {
        throw Error('Card found, but Expiry Day does not match');
      }
    } else {
      throw Error('Card found, but Name does not match');
    }

    if (card.balance < totalPrice) {
      throw Error(
        `Not enough money in your account brokie. Your balance is £${card.balance}`
      );
    }

    newBalance = card.balance - totalPrice;

    await card.updateOne({ balance: newBalance });

    res.status(200).json({ success: true, balance: newBalance });
  } catch (error) {
    res.status(400).json({ error: error.message, success: false });
  }
};

module.exports = {
  createCards,
  CheckCards,
};
