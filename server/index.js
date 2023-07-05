const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const Display = require('./models/display');
// store config variables in dotenv
require('dotenv').config();
const cors = require('cors');
var dbFunctions = require('./models/connector');
// ****** validation rules START ****** //
const valFunctions = require('./validators/validate');
const { db } = require('./models/user');
// ****** validation rules END ****** //


// Parse URL-encoded bodies
app.use(bodyParser.json({ limit: '1000000mb' }));
app.use(bodyParser.urlencoded({ limit: '1000000mb', extended: true }));

// ****** allow cross-origin requests code START ****** //
app.use(cors());
app.use(cors({
    origin: 'http://localhost:4200',
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
const allowedOrigins = process.env.allowedOrigins.split(',');
/**

 */
// ****** allow cross-origin requests code END ****** //

// app Routes
// create application/json parser
const jsonParser = bodyParser.json()
// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })
const Register = require('./models/register');
const User = require('./models/user');



// app.get('./models/register', (req, res) => {
//     Register.find({}, (err, registerInfo) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Internal server error' });
//         } else {
//             res.json(registerInfo);
//         }
//     });
// });

app.put('/api/checkout', (req, res) => {
    // Perform the necessary operations to update the checkout time
    const register = req.body; // Assuming the item data is sent in the request body
    // Update the checkoutDTTM property of the item in your data store or database

    // You can send a response back to the client if needed

    res.status(200).json({ message: 'Checkout time updated successfully' });
});


// POST /login gets urlencoded bodies
app.post('/signup', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    dbFunctions.createUser(req, res);
});
app.post('/login', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    dbFunctions.loginUser(req, res);
});

app.get('/latest-email', async (req, res) => {
    try {
        const latestUser = await User.findOne().sort({ _id: -1 }).limit(1);
        if (latestUser) {
            res.json({ email: latestUser.inputEmail });
        } else {
            res.json({ email: null });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch the latest email' });
    }
});
// Assuming you have the necessary code for retrieving the webcam image data and assigning it to the `webcamImageData` variable



app.get('/register', async (req, res) => {
    try {
        const registers = await Register.find({}).exec();
        res.send(registers);
    } catch (err) {
        console.log('Error:', err);
        res.status(500).send(err);
    }
});

app.post('/sethost', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    dbFunctions.setHost(req, res);
});
app.post('/updatehost', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    dbFunctions.updateHost(req, res);
});
app.post('/gethosts', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.getHosts(req, res);
});
app.post('/gethost', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.getHost(req, res);
});
app.post('/deletehost', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.deleteHost(req, res);
});
app.post('/setguest', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    dbFunctions.setGuest(req, res);
});
app.post('/updateguest', jsonParser, function (req, res) {
    if (valFunctions.checkInputDataNULL(req, res)) return false;
    if (valFunctions.checkInputDataQuality(req, res)) return false;
    //if(valFunctions.checkJWTToken(req,res)) return false;
    dbFunctions.updateGuest(req, res);
});
app.post('/getguests', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.getGuests(req, res);
});
app.post('/getguest', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.getGuest(req, res);
});
app.post('/deleteguest', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.deleteGuest(req, res);
});
app.post('/setregister', jsonParser, function (req, res) {
    //if(valFunctions.checkInputDataNULL(req,res)) return false;
    //if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.setRegister(req, res);
});
app.post('/getregister', jsonParser, function (req, res) {
    // if(valFunctions.checkInputDataNULL(req,res)) return false;
    // if(valFunctions.checkInputDataQuality(req,res)) return false;
    if (valFunctions.checkJWTToken(req, res)) return false;
    dbFunctions.getRegister(req, res);
});
// app.get('/register', (req, res) => {
//     Register.find({}, (err, data) => {
//         if (err) {
//             console.error(err);
//             res.status(500).json({ error: 'Internal server error' });
//         } else {
//             res.json(data);
//         }
//     });
// });
// app.post("/sendmail", (req, res) => {

//     console.log("request came");
//     let emailData = req.body;
//     sendMail(emailData, info => {
//         console.log('The mail has been send');
//         res.send(info);
//     })

// });

// async function sendMail(emailData, callback) {    // Create a nodemailer transporter with your SMTP configuration
//     let transporter = nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587,
//         secure: false,
//         auth: {
//             user: 'singhpakhi2020@gmail.com',
//             pass: 'jrhd ixjz mmhw jqnl',
//         },
//     });
//     let mailOptions = {
//         from: 'singhpakhi2002@gmail.com',
//         to: emailData.to
//         // subject: subject,
//         // text: body,
//     };




//     // Configure the email options

//     // Send the email
//     let info = await transporter.sendMail(mailOptions);
//     callback(info);
//     //     console.log(mailOptions);
//     // if (error) {
//     //     console.error('Error sending email:', error);
//     //     res.status(500).json({ error: 'Failed to send email' });
//     // } else {
//     //     console.log('Email sent:', info.response);
//     //     res.json({ message: 'Email sent successfully' });
//     // }
//     // });
// }
app.post('/sendmail', (req, res) => {
    const emailData = req.body;





    // Create a nodemailer transporter with your SMTP configuration
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'singhpakhi2020@gmail.com',
            pass: 'jrhdixjzmmhwjqnl'
        }
    });


    let mailOptions = {
        from: 'singhpakhi2002@gmail.com',
        to: emailData.to,
        subject: emailData.subject,
        text: emailData.body,
    };
    console.log(mailOptions)


    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Failed to send email' });
        } else {
            console.log('Email sent:', info.response);
            res.json({ message: 'Email sent successfully' });
        }
    });
});



app.use('/', (req, res) => res.send("Welcome Visitor Management App User !"));
app.listen(process.env.PORT, () => console.log('Pakhi Enterprise Server is ready on localhost:' + process.env.PORT));