const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
var wordpress = require('wordpress');

var client = wordpress.createClient({
    url: "https://feed.innaforapp.no/",
    username: process.env.WP_USERNAME,
    password: process.env.WP_PASWORD
});

function authFeed(req, res, next) {
    let token = req.headers['x-access-auth'] || req.body.token;

    try {
        let decodedToken = jwt.verify(token, secret); // Is the token valid?
        req.token = decodedToken; // we make the token available for later functions via the request object.

        if (req.token.role == "leader" || req.token.role == "org") {
            next(); // The token was valid so we continue 
        }
        else {
            res.status(401).end(); // The token could not be validated so we tell the user to log in again.
        }
    } catch (err) {
        res.status(401).end(); // The token could not be validated so we tell the user to log in again.
    }
}

router.get("/getGroups/", authFeed, async function (req, res) {
    try {
        let result = req.token.group;
        res.status(200).json({
            groups: result
        }).end();
    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end();
    }
});

router.post("/createPost/", authFeed, async function(req, res) {
  
    let title = req.body.title;
    let cont =  req.body.content;
    console.log(title, cont);
    
    try {              
        client.newPost({
            title: title,
            content: cont,
            status: "publish",
            termNames: {
                "category": [`${req.token.group}`] //trenerens gruppe som skal se postene
            },  
            customFields: [
                { key: "author", value: req.token.name},
                { key: "Role", value: "Leader" }
            ]
        }, function (error, data) {
            console.log("Post sent! The server replied with the following:\n");
            console.log(arguments);
            console.log("\n");
        });

     } catch (err) {
         console.log(err);
         res.status(500).json({
             mld: err
         }).end(); 
     } 
});

router.get("/showPosts/", async function(req, res) {
    try{
        client.getPosts({
            status: 'publish'
        }, 
        ['title', 'content', 'customFields', 'date', 'terms'],
        function (err, data) {
            //console.log(data);
            var sortGroup = data.filter(function (group) {
                return group.terms[0].name == "cat1";
            });
            console.log(sortGroup);
            res.status(200).json({
                posts: data,
                sort: sortGroup
            }).end();
        }
    );            
    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end();
    } 
});

module.exports = router;