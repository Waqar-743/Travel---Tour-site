/**
 * Models Index
 * Export all models from a single file
 */

const User = require('./User');
const Destination = require('./Destination');
const Trip = require('./Trip');
const Booking = require('./Booking');
const Review = require('./Review');
const Payment = require('./Payment');
const Inquiry = require('./Inquiry');

module.exports = {
  User,
  Destination,
  Trip,
  Booking,
  Review,
  Payment,
  Inquiry,
};
