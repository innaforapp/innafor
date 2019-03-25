const jwt = require('jsonwebtoken');

const db = require('./dbconnect').db;
const prpSql = require('./dbconnect').prpSql;

// SECRET -----------------------------
const secret = process.env.SECRET;

// AUTHENTICATE USER ------------------
function authenticateUser (req,res,next) {
   
    let token = req.headers['x-access-auth'] || req.body.token; 
  
    try {
        let decodedToken = jwt.verify(token, secret); // Is the token valid?
        req.token = decodedToken; // we make the token available for later functions via the request object.
        next(); // The token was valid so we continue 
        
    } catch (err) {
        res.status(401).end(); // The token could not be validated so we tell the user to log in again.
    }
}


// AUTHENTICATE USER ------------------
function authenticateAdmin (req,res,next) {
   
  let token = req.headers['x-access-auth'] || req.body.token; 

  try {
      let decodedToken = jwt.verify(token, secret); // Is the token valid?
      req.token = decodedToken; // we make the token available for later functions via the request object.

      if(req.token.role == "admin"){
        next(); // The token was valid so we continue 
      }
      else{
        res.status(401).end(); // The token could not be validated so we tell the user to log in again.
      }
      
  } catch (err) {
      res.status(401).end(); // The token could not be validated so we tell the user to log in again.
  }
}


// EXPORTS ----------------------------
module.exports.authenticateUser = authenticateUser;
module.exports.authenticateAdmin = authenticateAdmin;

