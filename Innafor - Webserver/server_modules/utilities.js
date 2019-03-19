const db = require('./dbconnect').db;
const prpSql = require('./dbconnect').prpSql;



function emailToLowerCase(req,res,next){
    let lowerCaseEmail = req.body.email.toLowerCase();
    req.body.email = lowerCaseEmail;
    next();
};


function nameToLowerCase(req,res,next){

    if(req.token.role == "org"){
    req.body.name = `${req.body.firstname} ${req.body.lastname}`; 
    }

    let lowerCaseName = req.body.name.toLowerCase();
    req.body.name = lowerCaseName;
    next();
}

//console log lowercase name
function nameAssigner(data, role){
    if(role == "admin"){
      return `${data.type}-${data.name}`;
    }
    else if(role == "org"){
      return data.name;
    }
  }


async function existingUsers(req,res,next){
    let data = req.body;
    let name = ""
    if(req.token.role == "admin"){
     name = nameAssigner(data, req.token.role);
    }
    let existingUser = prpSql.existingUser;
    existingUser.values = [data.email, name];
    
    try {
      let userData = await db.any(existingUser);

      if(req.token.role == "admin"){
          existingOrg(userData, req.body, res, next);
      }

      if(req.token.role == "org"){
        existingEmail(userData, req.body, res, next);
    }
  
    
    } catch (err) {
      console.log(err);
      res.status(500).json({
          mld: err
      }).end(); //something went wrong!
    }
  
  
  };


  function existingOrg(userData, data, res, next){
    let name = `${data.type}-${data.name}`;
    if(userData[0] == null){
       return next();
     }
      else if(userData[0].navn == name && userData[0].epost == data.email){
       return res.status(400).json({
            feedback:(`Org.navn (med type ${data.type}) og epost finnes allerede i systemt`)
        }).end();
      }
      else if(userData[0].epost == data.email){
       return res.status(400).json({
            feedback:"Epost er allerede registrert i systemet"
        }).end();
      }
      else if(userData[0].navn == name){
       return res.status(400).json({
            feedback:`Org.navn (med type ${data.type}) finnes allerede i systemet`
        }).end();
      }

};


  function existingEmail(userData, data, res, next){
    if(userData[0] == null || userData[0].epost != data.email){
      return next();
    }
      else if(userData[0].epost == data.email){
      return res.status(400).json({
            feedback:"Epost er allerede registrert i systemet"
        }).end();
      }
  };



  module.exports.existingUsers = existingUsers;
  module.exports.nameAssigner = nameAssigner;
  module.exports.emailToLowerCase = emailToLowerCase;
  module.exports.nameToLowerCase = nameToLowerCase;