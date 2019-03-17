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
        console.log(req.token);
        next(); // The token was valid so we continue 
        
    } catch (err) {
        res.status(401).end(); // The token could not be validated so we tell the user to log in again.
    }
}



async function existingUsers(req,res,next){

    let data = req.body;
    let org = `${data.type}-${data.org}`;
    let existingUser = prpSql.existingUser;
    existingUser.values = [data.email, org];
    
    try {
      let userData = await db.any(existingUser);
    if(userData[0] == null){
        next();
     }
      else if(userData[0].org == org && userData[0].epost == data.email){
        res.status(400).json({
            feedback:(`Org.navn (med type ${data.type}) og epost finnes allerede i systemt`)
        }).end();
      }
      else if(userData[0].epost == data.email){
        res.status(400).json({
            feedback:"Epost er allerede registrert i systemet"
        }).end();
      }
      else if(userData[0].org == org){
        res.status(400).json({
            feedback:`Org.navn (med type ${data.type}) finnes allerede i systemet`
        }).end();
      }
  
    
    } catch (err) {
      console.log(err);
      res.status(500).json({
          mld: err
      }).end(); //something went wrong!
  }
  
  
  
  }



// EXPORTS ----------------------------
module.exports.authorize = authenticateUser;
module.exports.existingUsers = existingUsers;
