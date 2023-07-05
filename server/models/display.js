const mongoose = require('mongoose');

const displaySchema = new mongoose.Schema({
    hostId: String,
    hostName: String,
    guestId: String,
    guestName: String,
    checkInDTTM: String,
    purpose: String,
    checkoutDTTM: String,
});

module.exports = mongoose.model('Display', displaySchema);