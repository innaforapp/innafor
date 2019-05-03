const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jwt = require("jsonwebtoken");
const secret = process.env.SECRET;
var wordpress = require('wordpress');

//logger inn på wordpress -admin
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

        if (req.token.role == "org" || req.token.role == "leader"  || req.token.role == "member") {
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
    let cont = req.body.cont;
    let selectedGroup = req.body.groups;
 
    try {              
        client.newPost({
            title: title,
            content: cont,
            status: "publish",
            termNames: {
                "category": [`${selectedGroup}`] //trenerens gruppe som skal se postene / org sender til alle i sin klubb
            },  
            customFields: [
                {key: "author", value: req.token.name},
                {key: "group", value: req.token.role}
            ]
        }, function (error, data) {
                console.log("Post er sendt!");
        });
     } catch (err) {
         console.log(err);
         res.status(500).json({
             mld: err
         }).end(); 
     } 
});

router.get("/showPosts/", authFeed,  async function(req, res) {

    let groups = req.token.group;
    try{
        client.getPosts({
            status: 'publish'
        }, 
        ['title', 'content', 'customFields', 'date', 'terms'],//hvilke filds som skal være med

        function (err, data) {
            let grp = groups[0].split("-")
            var myGroups =[]; //samler alle gruppe-array i en 
            console.log(data);

            for (let i = 0; i < groups.length; i++) {
                data.filter(function (group) {
                    if (group.terms[0].name == groups[i] || (group.terms[0].name == grp[0] + "-"+ grp[1] && !myGroups.includes(group))){
                        myGroups.push(group)
                    }
                });          
            } 

            res.status(200).json({
                posts: myGroups
            }).end();
        });            
    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end();
    } 
});

router.post("/deletePost/", async function (req, res) {
    let postId = req.body.postId;
    try {
        console.log(postId)
        client.deletePost(
            postId
            , function (error, data) {
                console.log("Post ble slettet!  \n" + error);
            });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end();
    }
});

module.exports = router;