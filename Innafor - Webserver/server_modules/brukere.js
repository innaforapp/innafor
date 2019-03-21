const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const authorize = require("./auth.js");

const existingUsers = require("./utilities.js").existingUsers;
const nameAssigner = require("./utilities.js").nameAssigner;
const emailToLowerCase = require("./utilities.js").emailToLowerCase;
const nameToLowerCase = require("./utilities.js").nameToLowerCase;


const db = require('./dbconnect').db;
const prpSql = require('./dbconnect').prpSql;

router.use(bodyParser.urlencoded({
    extended: true
}));

router.use(bodyParser.json());

function mainPageSelector(role){

  if(role === "admin"){
    return "mainView.router.navigate({ name: 'tabsAdmin' })"
  }
  else if(role === "member"){
    return "mainView.router.navigate({ name: 'tabsMembers' })"
  }
  else if(role === "org"){
    return "mainView.router.navigate({ name: 'tabsOrg' })"
  }
  else if(role === "leader"){
    return "mainView.router.navigate({ name: 'tabsLeader' })"
  }

}

//TODO: cahtche hvis den ikke finner brukeren
router.post("/login/", emailToLowerCase, async function (req, res) {

    let data = req.body;

    let findUser = prpSql.findUser;
    findUser.values = [data.email];

try {
  let userData = await db.any(findUser);
  let email = "";
  let hash = "";

  if(userData.length !== 0){
    email = userData[0].epost;
    hash = userData[0].hash;
  }

  let validateUser = (email) ? true:false;
  let validateHash = await bcrypt.compare(data.password, hash);
  let mainView = mainPageSelector(userData[0].rolle);


  if (validateUser && validateHash){
    let payload = {
      userID: userData[0].brukerid,
      role: userData[0].rolle,
      group: userData[0].gruppe,
    };
    let tok = jwt.sign(payload, secret, {
      expiresIn: "12h"
    });
    res.status(200).json({
    token: tok,
    event: mainView
  }).end();
  }else{
    res.status(400).json({
      feedback: "Feil brukernavn eller passord"
  }).end();
  }


    } catch (err) {
        res.status(500).json({
            error: err
        }); //something went wrong!
    }


});


function roleAssigner(role){

  if(role == "admin"){
    return "org";
  }
  else if(role == "org"){
    return "leader";
  }
  else if(role == "leader"){
    return "member";
  }

};

function groupAssigner(data, token){

  if(token.role == "admin"){
    return `{${data.type}-${data.name}}`;
  }
  else if(token.role == "org"){
    return `{${token.group}-${data.gender}-${data.yearmodel}}`;
    
  }
  else if(token.role == "leader"){
    return token.group;
  }

};



//TODO En trener og medlem kan ha flere grupper
router.post("/registrer/",authorize, nameToLowerCase, emailToLowerCase, existingUsers, async function (req, res) {

    let randomstring = "123";
    //let randomstring = Math.random().toString(36).slice(-8);

    let hash = bcrypt.hashSync(randomstring, 10);

    let role = roleAssigner(req.token.role);
    let group = groupAssigner(req.body, req.token);
    let name = nameAssigner(req.body, req.token.role);


    let regUserQuery = prpSql.regUser;
    regUserQuery.values = [name, req.body.email, group, role, hash];


    try {
        let regUser = await db.any(regUserQuery);

        /*
        //==Sender epost til bruker===
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                  host: "cpanel81.proisp.no",
                  port: 465,
                  secure: true, // true for 465, false for other ports
                  auth: {
                    user: "process.env.NOREPLY_MAIL", // generated ethereal user
                    pass: "process.env.NOREPLY_PASSORD" // generated ethereal password
                  }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                  from: `"No-Reply" <no-reply@innaforapp.no>`, // sender address
                  to: `${req.body.epost}`, // list of receivers
                  subject: "Velkommen til Innafor", // Subject line
                  html: `<h1>Velkommen</h1> <p>Ditt passord er: ${randomstring} </p>` // html body
                };

                // send mail with defined transport object
                let info = await transporter.sendMail(mailOptions)

                console.log("Message sent: %s", info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        //=======================
        */
    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }


});





module.exports = router;
