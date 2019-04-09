const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


const authorize = require("./auth.js").authenticateUser;
const authorizeAdmin = require("./auth.js").authenticateAdmin;
const authorizeLeader = require("./auth.js").authenticateLeader;




const db = require('./dbconnect').db;
const prpSql = require('./dbconnect').prpSql;

router.use(bodyParser.urlencoded({
    extended: true
}));


/*
router.post("/addQuestion/",authorizeAdmin, async function (req, res) {

    let addQuestionQuery = prpSql.addQuestion;
    addQuestionQuery.values = [req.body.question, req.body.theme, req.body.ageGroup, req.body.type, req.body.questionScale];
    try {
       let add = await db.any(addQuestionQuery);
        console.log(addQuestionQuery.values)
       res.status(200).json({
        event: `
        toastQuestionAdded.open();
        listOutQuestions();
        `
      }).end();


    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }


});
*/

router.post("/addCatagory",authorizeAdmin, async function (req, res) {

    let addCatagoryQuery = prpSql.addCategory;
    addCatagoryQuery.values = [req.body.category];
    try {
        let add = await db.any(addCatagoryQuery);

        res.status(200).json({
            event: `
            toastCategoryAdded.open();
            loadQuestionOptions();
            `
          }).end();


    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }


});


router.get("/getCategory",authorize, async function(req,res){

    let getCategory = prpSql.getCategory;

try {   
    let result = await db.any(getCategory);

    res.status(200).json({
        category: result
      }).end();


 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }

});

router.post("/addQuestion/",authorizeAdmin, async function (req, res) {
    let  data = req.body
    let existingQuestionSet = await existingCategory(data)
    let query

    if(existingQuestionSet === false){
        query = prpSql.newQuestionRow;
        query.values = [data.category, data.agegroup, data.question, data.weight, data.type];
    }
    else if(existingQuestionSet === true){
        query = prpSql.updateQuestionRow;
        query.values = [data.question, data.weight, data.category, data.agegroup, data.type];
    }
    
    try {
        let result = await db.any(query);

        res.status(200).json({
            event: `
            toastQuestionAdded.open();
            loadQuestionOptions();
            `
          }).end();


    } catch (err) {
        console.log(err);
        res.status(500).json({
            mld: err
        }).end(); //something went wrong!
    }


});




async function existingCategory(data){

    let existingCategory = prpSql.existingCombo;
    existingCategory.values = [data.category, data.agegroup, data.type];
    try {
      let result = await db.any(existingCategory);
      if(result.length == 0){
        return false;
      }
      else{
        return true;
        
      }


    }catch (err) {
      console.log(err);
      res.status(500).json({
          mld: err
      }).end(); //something went wrong!
    }

  }


  router.get("/getQuestions",authorize, async function(req,res){

        let getQuestionsQuery = prpSql.getQuestions;

    try {   
        let result = await db.any(getQuestionsQuery);

        
        res.status(200).json({
            pool: result
          }).end();

 
 
     } catch (err) {
         console.log(err);
         res.status(500).json({
             mld: err
         }).end(); //something went wrong!
     }


});

router.post("/deleteCategory",authorizeAdmin, async function(req,res){
    let data = req.body;

    let deleteCategory = prpSql.deleteCategory;
    deleteCategory.values=[data.id];

    let deleteQuestions = prpSql.deleteQuestions;
    deleteQuestions.values=[data.category];

try {   
    await db.any(deleteCategory);
    await db.any(deleteQuestions);

    res.status(200).json({
        event: `
        loadQuestionOptions();
        `
      }).end();

 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }


});


router.post("/deleteQuestion",authorizeAdmin, async function(req,res){
    let data = req.body;
    let newArray = [];
    

    console.log(data);

    let findCurrentArray = prpSql.getQuestionArray;
    findCurrentArray.values=[data.id];


try {
    
    let dbArray =  await db.any(findCurrentArray);
    let oldArray = dbArray[0].questions;
    let newArray = [];
    let delItem = [data.question, data.weight];

    
    for(i = 0; i < oldArray.length; i++) {
        let is_same = oldArray[i].length == delItem.length && oldArray[i].every(function arrayCheck(element, index) {
            return element === delItem[index]; 
        });
        
        if(is_same !== true){
            newArray.push(oldArray[i]);
        }
        }


     let eventFunction;  
    if(newArray.length == 0){
        let deleteQuestionSet = prpSql.noMoreQuestions;
        deleteQuestionSet.values=[data.id];
        let removeSet =  await db.any(deleteQuestionSet);
        eventFunction = `loadQuestionOptions();`
    }
    else{
        let updateQuestion = prpSql.updateQuestion;
        updateQuestion.values =[newArray, data.id]
        let updateArray =  await db.any(updateQuestion);
    }
    console.log(eventFunction);
    res.status(200).json({
        event: eventFunction
      }).end();



 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }
});


function arrayCheck(element, index) {
    return element === array2[index]; 
}





router.get("/getQuestionSets",authorizeLeader, async function(req,res){

    let type="";
    if(req.token.group.indexOf("Idrett")){
    type = "Idrett"
    }
    else if(req.token.group.indexOf("Skole")){
        type = "Skole"
    }

console.log(req.token.group)
    let getQuestionSet = prpSql.getQuestionSet;
    getQuestionSet.values=[type]

try {   
    let result = await db.any(getQuestionSet);

    res.status(200).json({
        pool: result,
        group: req.token.group
      }).end();


 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }


});


router.post("/createSurvay",authorizeLeader, async function(req,res){
let data = req.body

let createSurvay = prpSql.newSurvay;
createSurvay.values=[data.survay, data.group, data.survayPeriod, data.weekly]


try {   

    await db.any(createSurvay);

    res.status(200).json({
        res: data
      }).end();

 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }


});

/*
router.get("/getQuestions",authorize, async function(req,res){

        let getQuestionsQuery = prpSql.getQuestions;

    try {   
        let result = await db.any(getQuestionsQuery);

        
        res.status(200).json({
            questions: result
          }).end();

 
 
     } catch (err) {
         console.log(err);
         res.status(500).json({
             mld: err
         }).end(); //something went wrong!
     }


});



router.get("/getQuestionSets",authorizeLeader, async function(req,res){

    let type="";
    if(req.token.group.indexOf("Idrett")){
    type = "Idrett"
    }
    else if(req.token.group.indexOf("Skole")){
        type = "Skole"
    }

    let getQuestionSet = prpSql.getQuestionSet;
    getQuestionSet.values=[type]

try {   
    let result = await db.any(getQuestionSet);

    res.status(200).json({
        questionSet: result
      }).end();


 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }


});






router.post("/deleteQuestion",authorizeAdmin, async function(req,res){
    let data = req.body;

    let deleteQuestion = prpSql.deleteQuestion;
    deleteQuestion.values=[data.id]

try {   
    await db.any(deleteQuestion);

    
    res.status(200).json({
      }).end();



 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }
});


router.post("/deleteCategory",authorizeAdmin, async function(req,res){
    let data = req.body;

    let deleteCategory = prpSql.deleteCategory;
    deleteCategory.values=[data.id];

    let deleteQuestions = prpSql.deleteQuestions;
    deleteQuestions.values=[data.category];

try {   
    await db.any(deleteCategory);
    await db.any(deleteQuestions);

    res.status(200).json({
        event: `
        listOutQuestions();
        `
      }).end();

 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }


});

*/

//sender survay-data fra bruker til db

/*router.post("/sendData", authorize, async function(req,res,next){
    let surveyData = req.body.result;
    let query = `INSERT INTO "public"."survayresults"("id","results") VALUES (DEFAULT,'${surveyData}')`;
    console.log(surveyData);

try {
    let result = await db.any(query);
    console.log(result);
    res.status(200).json({
        msg: "Til server: "
    }).end();

}catch (err) {
    res.status(500).json({error : err});
}   
});*/


/*router.post("/sendData", async function(req,res,next){
    let surveyData = req.body.result;
    let whatToDo = req.body.whatToDo;
    console.log(req.body);

    if(whatToDo === "add results"){
        let query = `INSERT INTO public."survayresults"("results") VALUES('${surveyData}') RETURNING *`;
        console.log("query " + query);
    

        try {
            let result = await db.any(query);
            console.log("try");
            if(result.rows.length>0){
                res.status(200).json({
                    msg: "Til server: " + result.rows[0].surveyData,
                    surveyData: result.rows[0].surveyData
                }).end();
            }else{
                res.status(500).json({
                    error: "Kunne ikke snakke til server"
                });
            }

        } catch (error) {
            res.status(500).json({
                error: error
            }); //something went wrong!
            console.log("ERROR: " + error);
        }
    }
});*/











module.exports = router;