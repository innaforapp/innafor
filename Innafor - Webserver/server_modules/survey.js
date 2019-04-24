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

const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des']

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
    let activeSurvay = await validateDate(data.survayPeriod, data.group);
    console.log(activeSurvay)
    if(activeSurvay == false){
    await db.any(createSurvay);
    res.status(200).json({
            event: `toastSurvayCreated.open()`
      }).end();
    }
    else{
        res.status(400).json({
            event: `appF7.dialog.alert(
                'Du har allerede en spørreundersøkelse i denne perioden.');` 

        }).end();
    }

 } catch (err) {
     console.log(err);
     res.status(500).json({
         mld: err
     }).end(); //something went wrong!
 }


});


async function validateDate(newSurvayDate, group){

    let getSurvay = prpSql.getSurvay;
    getSurvay.values = [group]

    let startDate = new Date(newSurvayDate[0]);
    let endDate =  new Date(newSurvayDate[1]);

    try {   
        let survays = await db.any(getSurvay);

        let validDate = survays.reduce((hasElement, element) => {
            let survayStartDate = new Date(element.survayperiod[0]);
            var survayEndDate =  new Date(element.survayperiod[1]);
            //sjekker om datoen er innafor range
            if((startDate >= survayStartDate && startDate <= survayEndDate) ||
                (survayStartDate >= startDate && survayStartDate <= endDate)){

            hasElement = hasElement || true;
            }
            return hasElement;
      }, false);

      return validDate
        
     } catch (err) {
         console.log(err);
         res.status(500).json({
             mld: err
         }).end(); //something went wrong!
     }


}



router.get("/getActiveSurvay",authorize, async function(req,res){

    let survayByGroup = prpSql.survayByGroup;
    survayByGroup.values=[req.token.group]


    
    try {

        let result = await db.any(survayByGroup);
        let currentDate = new Date();
        let survay = []
        let particCheckData = [req.token.userID]
/*
        for (i = 0; i < result.length; i++) {
            if(currentDate > new Date(result[i].survayperiod[0]) && currentDate < new Date(result[i].survayperiod[1])){
                survay.push(result[i])
            }
        }*/
          for (i = 0; i < result.length; i++) {
            if(currentDate > new Date(result[i].survayperiod[0]) && currentDate < new Date(result[i].survayperiod[1])){
                survay.push(result[i])
                particCheckData.push(result[i].id)

            }
          }

          console.log(particCheckData);
          let quary = ``;
          for (j = 0; j < particCheckData.length; j++) {
            if(j == 0){
                quary += `SELECT timestamp, surveyid FROM "public"."participants" WHERE "userid" = ${particCheckData[j]}`
            }
            else if(j == 1){
                quary += ` AND surveyid = ${particCheckData[j]}`
            }
            else if(j >=2){
                quary += ` OR surveyid = ${particCheckData[j]} `
            }
          }

          let timestamps = await db.any(quary);
          console.log(timestamps)


          let currentTime = getTimeStamp(new Date());
          
          for (k = 0; k < survay.length; k++) {

            let unlockTime = timestamps.find(unlockTime => {
            if(survay[k].id == unlockTime.surveyid){
                console.log(survay[k].id, unlockTime.surveyid)

                timeObj = unlockTime.timestamp.unlockDate;
                console.log(timeObj.week, currentTime[0], timeObj.year, currentTime[2]);

                if(timeObj.week <= currentTime[0] && timeObj.year <= currentTime[2]){
                    console.log("true")
                    return
                }
                else{
                    delete survay[k]["survay"]
                    delete survay[k]["week"]
                    delete survay[k]["active"]
                    delete survay[k]["id"]
                    console.log("false")
                }

            }

             });

            unlockTime



          }

         



        console.log(survay)

        res.status(200).json({
            survay: survay
      }).end();
       
        
     } catch (err) {
         console.log(err);
         res.status(500).json({
             mld: err
         }).end(); //something went wrong!
     }
    
    
    });


    router.post("/sendSurvay",authorize, checkTimestamp, async function(req,res){

        //[Uke, Mnd, År]
        let date = getTimeStamp(new Date());
        //timestamp til den åpner igjen
        let timestamp = {"unlockDate": {
            week:  req.body.weekInBetween + date[0],
            month: date[1],
            year: date[2]
            }
        }
        let currentMonth = monthName[new Date().getMonth()];
        
        let participate = prpSql.participate;
        participate.values=[req.token.userID, timestamp, req.body.surveyId]

        let sendSurvey = prpSql.sendSurvey;
        sendSurvey.values=[req.body.results, req.body.surveyId, currentMonth]


        try {   

            let validAnswers
            for(i = 0; i < Object.keys(req.body.results).length; i++) {
                let questionCat = Object.keys(req.body.results)[i];
                console.log(req.body.results[questionCat]);
        
                let checkSurvey = req.body.results[questionCat].find(checkSurvey => {
                   if(checkSurvey.answer === ""){
                    validAnswers = false
                   }
                   else{
                    validAnswers = true
                   }
                 });
            }

            console.log(validAnswers)
            if(validAnswers){
                await db.any(participate);
                await db.any(sendSurvey);

                res.status(200).json({
                    event: `appF7.preloader.hide(); 
                            mainView.router.back({url: 'pages/Members/siIfraFrontpage.html', force: true, ignoreCache: true,reload: true});
                            toastSurveySendt.open();
                            `

                            
              }).end();
            }
            else{
                res.status(400).json({
                    event: `appF7.dialog.alert('Vennligs svar på alle spørsmålene');`
              }).end();

            }


         } catch (err) {
             console.log(err);
             res.status(500).json({
                 mld: err
             }).end(); //something went wrong!
         }



        });

        function getTimeStamp(d) {
            // Copy date so don't modify original
            d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
            // Get first day of year
            let yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
            // Calculate full weeks to nearest Thursday
            let weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        
            let month = new Date().getMonth() + 1;
        
            return [weekNo, month, d.getUTCFullYear()]
        }


        
        
        async function checkTimestamp(req,res,next){
            
            let getparticipants = prpSql.getparticipants;
            getparticipants.values=[req.token.userID, req.body.surveyId]

            let currentTime = getTimeStamp(new Date());
            
            try {   
                let particCheck = await db.any(getparticipants)
                
                let unlockTime = particCheck.find(unlockTime => {
                   timeObj = unlockTime.timestamp.unlockDate;
                   //console.log(timeObj.week, currentTime[0], timeObj.year, currentTime[2]);

                   if(timeObj.week < currentTime[0] && timeObj.year <= currentTime[2]){
                       return true
                   }
                   else{
                      return false
                   }
                });
                console.log(unlockTime)
                if(unlockTime || particCheck.length === 0){
                    next()
                }
                else{
                    res.status(401).end();
                }
            
             } catch (err) {
                 console.log(err);
                 res.status(500).json({
                     mld: err
                 }).end(); //something went wrong!
             }

        }



    router.get("/getResults",authorizeLeader, async function(req,res){
        let survayByGroup = prpSql.survayByGroup;
        survayByGroup.values=[req.token.group]

        let currentDate = new Date();
        let activeSurveys = {};
        let arcivedSurveys = {};

        try {   

            let survays = await db.any(survayByGroup);

            for (i = 0; i < survays.length; i++) {
                let fromDate  = new Date(survays[i].survayperiod[0]);
                let toDate  = new Date(survays[i].survayperiod[1]);
                let period = `${fromDate.getDate()}.${monthName[fromDate.getMonth()]}.${fromDate.getFullYear()} - ${toDate.getDate()}.${monthName[toDate.getMonth()]}.${toDate.getFullYear()}`
                
                let survayKeys = Object.keys(survays[i].survay); 
                let theme = "";

                survayKeys.forEach(function(survayKeys) {
                    theme += survayKeys.split('-')[2]+" "
                    
                  });
                  
                
                
                if(currentDate > new Date(survays[i].survayperiod[0]) && currentDate < new Date(survays[i].survayperiod[1])){
                    activeSurveys[survays[i].group] = {
                        [`${survays[i].id}`] : {
                            period: period,
                            theme: theme,
                            results: []
                        } 
                    };
                }
                else{

                    arcivedSurveys[survays[i].group] = {
                        [`${survays[i].id}`] : {
                            period: period,
                            theme: theme,
                            results: []
                        } 
                    };
                }
              }



            let getSurvayResults = ``;
            for(j = 0; j < survays.length; j++) {
                if(j === 0){
                    getSurvayResults = `SELECT * FROM public.survayresults WHERE "surveyid"='${survays[j].id}'`;
                }
                else{
                    getSurvayResults += `  OR "surveyid"='${survays[j].id}'`;
                }

            };
            getSurvayResults +=` ORDER BY id`
            let results = await db.any(getSurvayResults);
            console.log(results)
            
            let activeResultKey=[]
            let activeGroupKey = Object.keys(activeSurveys); 
            activeGroupKey.forEach(function(activeGroupKey) {
                activeResultKey.push(Object.keys(activeSurveys[activeGroupKey])[0]); 
            });
            

            let arciveResultKey=[]
            let arciveGroupKey = Object.keys(arcivedSurveys); 
            arciveGroupKey.forEach(function(arciveGroupKey) {
                arciveResultKey.push(Object.keys(arcivedSurveys[arciveGroupKey])[0]); 
            });


            for (h = 0; h < activeGroupKey.length; h++) {
                for (k = 0; k < results.length; k++) {
                    activeResultKey.forEach(function(activeResultKey) {
                        if(activeSurveys[activeGroupKey[h]][activeResultKey] && activeResultKey == results[k].surveyid){
                            activeSurveys[activeGroupKey[h]][activeResultKey].results.push(results[k])
                        }
                    });
                }
            }


            for (h = 0; h < arciveGroupKey.length; h++) {
                for (k = 0; k < results.length; k++) {
                    arciveResultKey.forEach(function(arciveResultKey) {
                        if(activeSurveys[arciveGroupKey[h]][arciveResultKey] && arciveResultKey == results[k].surveyid){
                            arcivedSurveys[arciveGroupKey[h]][arciveResultKey].results.push(results[k])
                        }
                    });
                }

            }



            res.status(200).json({
                groups: req.token.group,
                arcivedSurveys: arcivedSurveys,
                activeSurvays: activeSurveys 
            }).end();
            
        
         } catch (err) {
             console.log(err);
             res.status(500).json({
                 mld: err
             }).end(); //something went wrong!
         }

    });






module.exports = router;