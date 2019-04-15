const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();

const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const secret = process.env.SECRET;

const authorize = require("./auth.js").authenticateUser;

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

function mainPageSelector(role) {

    if (role === "admin") {
        return "mainView.router.navigate({ name: 'tabsAdmin' })"
    } else if (role === "member") {
        return "mainView.router.navigate({ name: 'tabsMembers' })"
    } else if (role === "org") {
        return "mainView.router.navigate({ name: 'tabsOrg' })"
    } else if (role === "leader") {
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

        if (userData.length !== 0) {
            email = userData[0].epost;
            hash = userData[0].hash;
        }

        let validateUser = (email) ? true : false;
        let validateHash = await bcrypt.compare(data.password, hash);
        let mainView = mainPageSelector(userData[0].rolle);


        if (validateUser && validateHash) {
            let payload = {
                userID: userData[0].brukerid,
                role: userData[0].rolle,
                group: userData[0].gruppe,
                email: userData[0].epost,
                name: userData[0].navn
            };
            let tok = jwt.sign(payload, secret, {
                expiresIn: "1000h"
            });
            res.status(200).json({
                token: tok,
                firstname: userData[0].navn,
                email: userData[0].epost,
                event: mainView
            }).end();
        } else {
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


function roleAssigner(role) {

    if (role == "admin") {
        return "org";
    } else if (role == "org") {
        return "leader";
    } else if (role == "leader") {
        return "member";
    }

};

function groupAssigner(data, token) {

    if (token.role == "admin") {
        return `{${data.type}-${data.name}}`;
    } else if (token.role == "org") {
        return `{${token.group}-${data.gender}-${data.yearmodel}}`;

    } else if (token.role == "leader") {
        return `{${data.group}}`;
    }

};



//TODO En trener og medlem kan ha flere grupper
router.post("/registrer/", authorize, nameToLowerCase, emailToLowerCase, existingUsers, async function (req, res) {

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

        //==Sender epost til bruker===
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
            from: `"No-Reply" <no-reply@innaforapp.no>`, // sender address
            to: `${req.body.email}`, // list of receivers
            subject: "Velkommen til Innafor", // Subject line
            html: `<h1>Velkommen</h1> <p>Ditt passord er: ${randomstring} </p>` // html body
        };

        // send mail with defined transport object
        let info = await transporter.sendMail(mailOptions)

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        res.status(200).json({
            event: `toatsUserRegister.open();`
        }).end();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }

});


router.post("/update/email", authorize, async function (req, res) {

    // VARIABLES
    let column = req.body.column;
    let newValue = req.body.value;
    let email = req.token.email.toLowerCase();

    // GET USER
    let getUserQuery = prpSql.findUser;
    getUserQuery.values = [email];

    try {
        let user = await db.any(getUserQuery);

        // UPDATE USER
        let updateUserQuery = prpSql.updateUserEmail;
        updateUserQuery.values = [email, newValue];
        let updatedUser = await db.any(updateUserQuery);

        let payload = {
            userID: updatedUser[0].brukerid,
            role: updatedUser[0].rolle,
            group: updatedUser[0].gruppe,
            email: updatedUser[0].epost,
        };

        console.log(payload);
        let tok = jwt.sign(payload, secret, {
            expiresIn: "12h"
        });

        res.status(200).json({
            msg: 'Ok, e-post endret til ' + newValue,
            email: updatedUser[0].epost,
            token: tok,
            firstname: updatedUser[0].navn,
            email: updatedUser[0].epost,
        }).end();


    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        }).end(); //something went wrong!
    }

});

router.post("/checkPassword", authorize, async function (req, res) {

    let data = req.body;

    let findUser = prpSql.findUser;
    findUser.values = [data.email];

    try {
        let userData = await db.any(findUser);
        let email = "";
        let hash = "";

        if (userData.length !== 0) {
            email = userData[0].epost;
            hash = userData[0].hash;
        }

        let validateHash = await bcrypt.compare(data.password, hash);

        if (validateHash) {
            res.status(200).json({}).end();

        } else {
            res.status(400).json({
                msg: "Feil passord"
            }).end();
        }


    } catch (err) {
        res.status(500).json({
            error: err
        }); //something went wrong!
    }

});

router.post("/update/password", authorize, async function (req, res) {

    // VARIABLES
    let newPassword = req.body.password;
    let email = req.token.email;

    // GET USER
    let getUserQuery = prpSql.findUser;
    getUserQuery.values = [email];

    try {
        let user = await db.any(getUserQuery);

        // ENCRYPT PASSWORD
        let hash = bcrypt.hashSync(newPassword, 10);

        // UPDATE USER
        let updateUserQuery = prpSql.updateUserPassword;
        updateUserQuery.values = [email, hash];
        let updatedUser = await db.any(updateUserQuery);

        res.status(200).json({
            msg: 'Ok, passord endret.'
        }).end();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        }).end(); //something went wrong!
    }

});

router.post("/delete", authorize, async function (req, res) {

    console.log(req.body);
    // VARIABLES
    let id = req.body.id;
    let group = req.body.group;

    // GET USER
    let getUserQuery = prpSql.findUserById;
    getUserQuery.values = [id];

    try {
        let user = await db.any(getUserQuery);
        let oldGroups = user[0].gruppe;
        let newGroups = [];

        for (let i = 0; i < oldGroups.length; i++) {
            console.log(oldGroups[i], group);

            if (oldGroups[i] !== group) {
                newGroups.push(oldGroups[i]);
            }
        }

        // UPDATE USER
        let updateUserQuery = prpSql.updateUserGroups;
        updateUserQuery.values = [id, newGroups];
        let updatedUser = await db.any(updateUserQuery);

        res.status(200).json({
            msg: 'Ok, bruker er fjernet fra din gruppe.'
        }).end();

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: err
        }).end(); //something went wrong!
    }

});

router.get("/getMyGroups", authorize, async function (req, res) {

    let email = req.token.email.toLowerCase();

    // GET USER
    let getUserQuery = prpSql.findUser;
    getUserQuery.values = [email];

    try {
        let user = await db.any(getUserQuery);

        let groups = user[0].gruppe;

        res.status(200).json({
            groups: groups
        }).end();


    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }

});

router.get("/getUsersInGroup", authorize, async function (req, res) {

    let email = req.token.email.toLowerCase();
    let group = req.get('Group');
    console.log(group);

    // GET USER
    let getUsersQuery = prpSql.getUsersInGroup;
    getUsersQuery.values = [group];

    try {
        let users = await db.any(getUsersQuery);
        console.log(users);

        res.status(200).json(users).end();


    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }

});



module.exports = router;
