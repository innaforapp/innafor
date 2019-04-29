const db = require('./dbconnect').db;
const prpSql = require('./dbconnect').prpSql;

const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;



function emailToLowerCase(req,res,next){
    let lowerCaseEmail = req.body.email.toLowerCase();
    req.body.email = lowerCaseEmail;
    next();
};


function nameToLowerCase(req,res,next){

    if(req.token.role == "org" || req.token.role == "leader"){
    req.body.name = `${req.body.firstname} ${req.body.lastname}`; 
    }
    let lowerCaseName = req.body.name.toLowerCase();
    req.body.name = lowerCaseName;
    next();
}


function nameAssigner(data, role){
    if(role == "admin"){
      return `${data.type}-${data.name}`;
    }
    else if(role == "org" || role == "leader"){
      return data.name;
    }
  }

//TODO: Hvis eposten til rollen "bruker" og "leder" finnes, la de være med i flere lag
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
      else if(req.token.role == "org" || req.token.role == "leader"){
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


  async function existingEmail(userData, data, res, next){
    if(userData[0] == null || userData[0].epost != data.email){
      return next();
    }
      else if(userData[0].epost == data.email){

        let add = await addGroup(userData[0], data)

        add
      /*return res.status(400).json({
            feedback:"Epost er allerede registrert i systemet"
        }).end();*/
      }
  };


async function addGroup(dbData, clientData, token){
  
  try {
    let decodedToken = jwt.verify(clientData.token, secret); // Is the token valid?
    token = decodedToken; // we make the token available for later functions via the request object.
    //TODO: FIX THIS!
    let addGroup = `UPDATE "public"."brukere" SET gruppe = array_append(gruppe, '${token.name}-${clientData.gender}-${clientData.yearmodel}') WHERE brukerid = ${dbData.brukerid}`;

    if(dbData.gruppe.length > 0 && !dbData.gruppe.includes(`${token.name}-${clientData.gender}-${clientData.yearmodel}`)){
      let dbGroup = dbData.gruppe[0].split("-");
      let orgGroup = token.group[0].split("-");

      if(dbGroup[0]+[dbGroup[1]] == orgGroup[0]+[orgGroup[1]]){
        await db.any(addGroup);
      }
      else{
        console.log("Bruker registrert hos en annen org")
      }
  }
  else if(dbData.gruppe.length == 0){
        await db.any(addGroup);
  }
  else{
    console.log("Epost du prøver å registerere er allerede i denne gruppen")
  }
    
  } catch (err) {
    console.log(err);
    res.status(500).json({
        mld: err
    }).end(); //something went wrong!
}

}



  module.exports.existingUsers = existingUsers;
  module.exports.nameAssigner = nameAssigner;
  module.exports.emailToLowerCase = emailToLowerCase;
  module.exports.nameToLowerCase = nameToLowerCase;
