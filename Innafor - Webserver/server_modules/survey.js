const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


const authorize = require("./auth.js").authenticateUser;
const authorizeAdmin = require("./auth.js").authenticateAdmin;


const db = require('./dbconnect').db;
const prpSql = require('./dbconnect').prpSql;

router.use(bodyParser.urlencoded({
    extended: true
}));


router.post("/addQuestion/",authorizeAdmin, async function (req, res) {

    let addQuestionQuery = prpSql.addQuestion;
    addQuestionQuery.values = [req.body.question, req.body.theme, req.body.ageGroup, req.body.type];
    try {
       let add = await db.any(addQuestionQuery);

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


router.post("/addCatagory",authorizeAdmin, async function (req, res) {

    let addCatagoryQuery = prpSql.addCategory;
    addCatagoryQuery.values = [req.body.category];
    try {
        let add = await db.any(addCatagoryQuery);

        res.status(200).json({
            event: `
            toastCategoryAdded.open();
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







module.exports = router;