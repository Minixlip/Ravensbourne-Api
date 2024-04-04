const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
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
    gender: {
      type: String,
      required: true,
      uppercase: true,
    },
    postCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    city: {
      type: String,
      required: true,
      uppercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    dateOfBirthDay: {
      type: String,
      required: true,
    },
    dateOfBirthMonth: {
      type: String,
      required: true,
    },
    dateOfBirthYear: {
      type: String,
      required: true,
    },
    graduationYear: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    streetName: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
