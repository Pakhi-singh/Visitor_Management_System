const mongoose = require('./dbconnection');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('./user');
const Host = require('./host');
const Guest = require('./guest');
const Register = require('./register');
const Display = require('./display');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var resultsNotFound = {
    "errorCode": 0,
    "errorMessage": "Operation not successful.",
    "rowCount": 0,
    "data": ""
};

var resultsFound = {
    "errorCode": 1,
    "errorMessage": "Operation successful.",
    "rowCount": 1,
    "data": ""
};
// const multer = require('multer');

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // Specify the directory to store the uploaded images
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     // Generate a unique filename for the uploaded image
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, file.fieldname + '-' + uniqueSuffix);
//   }
// });

// // Create multer instance with the storage configuration
// const upload = multer({ storage: storage });

module.exports = {
    createUser: function (req, res) {
        bcrypt.hash(req.body.inputPassword, saltRounds, function (err, hash) {
            return User.find({ inputEmail: req.body.inputEmail }).then((results) => {
                if (results.length > 0) {
                    resultsNotFound["errorMessage"] = "User email is already taken.";
                    return res.send(resultsNotFound);
                } else {
                    let user = new User({ inputEmail: req.body.inputEmail, inputPassword: hash });
                    user.save();
                    return res.send(resultsFound);
                }
            })
        });
    },
    // saveDisplay: async function (displayData) {
    //     const display = new Display(displayData);
    //     return display.save();
    // },

    // updateCheckoutTime: function (guestName, checkInDTTM, checkoutDTTM) {
    //     return Register.findOneAndUpdate(
    //         { guestName, checkInDTTM },
    //         { checkoutDTTM },
    //         { new: true }
    //     )
    //         .exec()
    //         .then((register) => {
    //             return register;
    //         })
    //         .catch((error) => {
    //             throw error;
    //         });
    // },
    // checkout: function (req, res) {
    //     const { guestName, checkInDTTM } = req.body;

    //     Display.findOneAndUpdate(
    //         { guestName, checkInDTTM },
    //         { checkoutDTTM: new Date().toLocaleString() },
    //         { new: true },
    //         (err, display) => {
    //             if (err) {
    //                 console.error('Error updating checkout time:', err);
    //                 res.status(500).json({ message: 'Failed to update checkout time' });
    //             } else {
    //                 res.status(200).json(display);
    //             }
    //         }
    //     );
    // },
    // sendEmail: function (to) {
    //     const mailOptions = {
    //         from: 'singhpakhi2002@gmail.com',
    //         to: to,
    //         // subject: subject,
    //         // text: body
    //     };
    //     console.log(this.checkInHostEmail);

    //     return transporter.sendMail(mailOptions);
    // },
    loginUser: function (req, res) {
        return User.find({ inputEmail: req.body.inputEmail }).then((results) => {
            if (results.length > 0) {
                // email is correct, checking password
                bcrypt.compare(req.body.inputPassword, results[0].inputPassword, function (err, result) {
                    if (result == true) {
                        var token = {
                            "token": jwt.sign(
                                { email: req.body.inputEmail },
                                process.env.JWT_SECRET,
                                { expiresIn: '30d' }
                            )
                        }
                        resultsFound["data"] = token;
                        res.send(resultsFound);
                    } else {
                        resultsNotFound["errorMessage"] = "Incorrect Password.";
                        return res.send(resultsNotFound);
                    }
                });
                // password validation complete
            } else {
                // email is not correct
                resultsNotFound["errorMessage"] = "User Id not found.";
                return res.send(resultsNotFound);
            }
        })
    },
    setHost: function (req, res) {
        let host = new Host({
            inputName: req.body.inputName, inputAddress: req.body.inputAddress, inputEmail: req.body.inputEmail,
            inputPhone: req.body.inputPhone,
            inputComments: req.body.inputComments
        });
        host.save();
        return res.send(resultsFound);
    },
    updateHost: function (req, res) {
        return Host.updateOne({ _id: req.body._id }, req.body, { upsert: true, setDefaultsOnInsert: true }).then((results) => {
            if (results) {
                res.send(resultsFound);
            } else {
                return res.send(resultsNotFound);
            }
        });
    },
    deleteHost: function (req, res) {
        return Host.deleteOne({ _id: req.body._id }).then((results) => {
            if (results) {
                console.log("res")
                console.log(results)
                res.send(resultsFound);
            } else {
                return res.send(resultsNotFound);
            }
        });
    },
    getHosts: function (req, res) {
        return Host.find({
            "inputName": (req.body.inputName) ? req.body.inputName : /.*/,
            "inputAddress": (req.body.inputAddress) ? req.body.inputAddress : /.*/,
            "inputEmail": (req.body.inputEmail) ? req.body.inputEmail : /.*/,
            "inputPhone": (req.body.inputPhone) ? req.body.inputPhone : /.*/
        })
            .then((results) => {
                if (results.length > 0) {
                    resultsFound.data = results;
                    res.send(resultsFound);
                } else {
                    return res.send(resultsNotFound);
                }
            });
    },
    getHost: function (req, res) {
        return Host.find({ _id: req.body._id })
            .then((results) => {
                if (results.length > 0) {
                    resultsFound.data = results;
                    res.send(resultsFound);
                } else {
                    return res.send(resultsNotFound);
                }
            });
    },
    setGuest: function (req, res) {

        let guest = new Guest({
            inputName: req.body.inputName,
            inputAddress: req.body.inputAddress,
            inputEmail: req.body.inputEmail,
            inputPhone: req.body.inputPhone,
            inputComments: req.body.inputComments,
            // webcamImageData: req.body.webcamImageData


        });
        guest.save();
        return res.send(resultsFound);


    },
    updateGuest: function (req, res) {
        return Guest.updateOne({ _id: req.body._id }, req.body, { upsert: true, setDefaultsOnInsert: true }).then((results) => {
            if (results) {
                res.send(resultsFound);
            } else {
                return res.send(resultsNotFound);
            }
        });
    },
    deleteGuest: function (req, res) {
        return Guest.deleteOne({ _id: req.body._id }).then((results) => {
            if (results) {
                console.log("res")
                console.log(results)
                res.send(resultsFound);
            } else {
                return res.send(resultsNotFound);
            }
        });
    },
    getGuests: function (req, res) {
        return Guest.find({
            "inputName": (req.body.inputName) ? req.body.inputName : /.*/,
            "inputAddress": (req.body.inputAddress) ? req.body.inputAddress : /.*/,
            "inputEmail": (req.body.inputEmail) ? req.body.inputEmail : /.*/,
            "inputPhone": (req.body.inputPhone) ? req.body.inputPhone : /.*/
        })
            .then((results) => {
                if (results.length > 0) {
                    resultsFound.data = results;
                    res.send(resultsFound);
                } else {
                    return res.send(resultsNotFound);
                }
            });
    },
    getGuest: function (req, res) {
        return Guest.find({ _id: req.body._id })
            .then((results) => {
                if (results.length > 0) {
                    resultsFound.data = results;
                    res.send(resultsFound);
                } else {
                    return res.send(resultsNotFound);
                }
            });
    },
    setRegister: function (req, res) {
        let register = new Register({
            hostId: req.body.hostId, hostName: req.body.hostName, guestId: req.body.guestId,
            guestName: req.body.guestName,
            checkInDTTM: req.body.checkInDTTM,
            purpose: req.body.purpose,
            webcamImageData: req.body.webcamImageData,

        });
        register.save();
        return res.send(resultsFound);
    },
    getRegister: async function (req, res) {
        if (req.body.srchType == "guest") {
            const results = await Register.find({ "guestId": req.body._id });
            if (results.length > 0) {
                resultsFound.data = results;
                res.send(resultsFound);
            } else {
                return res.send(resultsNotFound);
            }
        } else {
            const results_1 = await Register.find({ "hostId": req.body._id });
            if (results_1.length > 0) {
                resultsFound.data = results_1;
                res.send(resultsFound);
            } else {
                return res.send(resultsNotFound);
            }
        }
    }

};