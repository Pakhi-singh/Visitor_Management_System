const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const guestSchema = new Schema({
    inputName: String,
    inputAddress: String,
    inputEmail: String,
    inputPhone: String,
    inputComments: String,
    // webcamImageData: String,



});

module.exports = mongoose.model('Guest', guestSchema);