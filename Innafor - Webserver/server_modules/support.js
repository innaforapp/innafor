const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const nodemailer = require('nodemailer');

const secret = process.env.SECRET;
const authorize = require("./auth.js").authenticateUser;

const nameAssigner = require("./utilities.js").nameAssigner;
const emailToLowerCase = require("./utilities.js").emailToLowerCase;


router.use(bodyParser.urlencoded({
    extended: true
}));


router.post("/report/", authorize, emailToLowerCase, async function (req, res) {

    let name = req.body.name;
    let email = req.body.email;
    let message = req.body.message;

    //==================

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "cpanel81.proisp.no",
        port: 26,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.NOREPLY_MAIL,
            pass: process.env.NOREPLY_PASSORD
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'no-reply@innaforapp.no', // sender address
        to: "support@innaforapp.no", // list of receivers
        subject: "Ny henvendelse fra rapporteringsskjema", // Subject line
        html: `<div>` +
            `<h1>Henvendelse fra rapporteringsskjema i innafor-app</h1>` +
            `<div>` +
            `<b>Innsenders navn: </b>${name}<br>` +
            `<b>Innsenders mailadresse: </b>${email}<br>` +
            `</div>` +
            `<div>` +
            `<h2>Melding:</h2><br>` +
            `<p>${message}</p>` +
            `</div>` +
            `</div>` // html body
    };

    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions)

    console.log("Message sent: %s", info.messageId);
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

});

module.exports = router;



router.post("/sendMailToLeader/", authorize, async function (req, res) {
    console.log(req.token)

    try {



        
    }catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }



});