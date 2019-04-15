

const pgp = require('pg-promise')();
//db connect string
const db = pgp(process.env.DB_URL);

const PrpSt = require('pg-promise').PreparedStatement;
const prpSql = {};

//User-----------------
prpSql.regUser = new PrpSt('regUser',`INSERT INTO "public"."brukere" ("brukerid", "navn", "epost", "gruppe", "rolle", "hash") VALUES (DEFAULT, $1, $2, $3, $4, $5)`);

prpSql.findUser = new PrpSt('findUser', `SELECT * FROM "public"."brukere" WHERE epost = $1`);

prpSql.updateUserEmail = new PrpSt('updateUserEmail', `UPDATE "public"."brukere" SET epost = $2 WHERE epost = $1 RETURNING "brukerid", "navn", "epost", "gruppe", "rolle", "hash"`);

prpSql.updateUserPassword = new PrpSt('updateUserPassword', `UPDATE "public"."brukere" SET hash = $2 WHERE epost = $1 RETURNING "brukerid", "navn", "epost", "gruppe", "rolle", "hash"`);

prpSql.existingUser = new PrpSt('existingUser', `SELECT * FROM "public"."brukere" WHERE epost=$1 OR navn=$2`);


//survey--------------
prpSql.addCategory = new PrpSt('addCategory',`INSERT INTO "public"."questioncategory" ("id", "category", "active") VALUES (DEFAULT, $1, DEFAULT)`);
prpSql.getCategory = new PrpSt('getCategory', `SELECT * FROM "public"."questioncategory" WHERE "active" = 'true' `);
prpSql.getQuestions = new PrpSt('getQuestions', `SELECT * FROM "public"."questionpoolv2" WHERE "active" = 'true' ORDER BY category `);

//Ser om spørsmål i samme kategori finnes
prpSql.existingCombo = new PrpSt('existingCombo', `SELECT * FROM "public"."questionpoolv2" WHERE "category" = $1 AND "agegroup" = $2 AND "type" = $3 AND "active" = 'true' `);
//Opretter et nytt spørsmål set
prpSql.newQuestionRow = new PrpSt('newQuestionRow',
`INSERT INTO "public"."questionpoolv2" ("id", "category", "agegroup", "questions", "active", "type")
VALUES (DEFAULT, $1, $2, ARRAY[ARRAY[$3, $4]], DEFAULT, $5);`);
//Legger nytt spørsmål til array
prpSql.updateQuestionRow = new PrpSt('updateQuestionRow',
`UPDATE "public"."questionpoolv2"
SET questions = array_cat(questions, ARRAY[ARRAY[$1, $2]])
WHERE category = $3 AND agegroup = $4 AND type = $5;
`);


prpSql.deleteCategory = new PrpSt('deleteCategory', `UPDATE "public"."questioncategory" SET "category" = '-', "active" = 'false' WHERE "id" = $1`);
prpSql.deleteQuestions = new PrpSt('deleteQuestions', `UPDATE "public"."questionpoolv2" SET "questions" = '{}', "category" = '-', "active" = 'false', type = '-', agegroup = '-' WHERE "category" = $1`);

prpSql.getQuestionArray = new PrpSt('getQuestionArray', `SELECT questions FROM "public"."questionpoolv2" WHERE id = $1`);
prpSql.updateQuestion = new PrpSt('updateQuestion', `UPDATE "public"."questionpoolv2" SET questions = $1 WHERE id = $2`);
prpSql.noMoreQuestions = new PrpSt('noMoreQuestions', `UPDATE "public"."questionpoolv2" SET "questions" = '{}', "category" = '-', "active" = 'false', type = '-', agegroup = '-' WHERE "id" = $1`);

//Henter spørsmål til trener
prpSql.getQuestionSet = new PrpSt('getQuestionSet', `SELECT * FROM "public"."questionpoolv2" WHERE "active" = 'true' AND "type" = $1`);
prpSql.newSurvay = new PrpSt('newSurvay',`INSERT INTO "public"."surveys" ("id", "survay", "group", "survayperiod", "week", "active") VALUES (DEFAULT, $1, $2, $3, $4, DEFAULT);`);


prpSql.getSurvay = new PrpSt('getSurvay', `SELECT * FROM "public"."surveys" WHERE "group" = $1`);
prpSql.survayByGroup = new PrpSt('survayByGroup', `SELECT * FROM "public"."surveys" WHERE "group"=ANY($1)`);

prpSql.participate = new PrpSt('participate', `INSERT INTO "public"."participants" ("id", "userid", "timestamp", "surveyid") VALUES (DEFAULT, $1, $2, $3)`)
prpSql.sendSurvey = new PrpSt('sendSurvey', `INSERT INTO "public"."survayresults" ("id", "results", "surveyid") VALUES (DEFAULT, $1, $2)`)

prpSql.getparticipants = new PrpSt('getparticipants', `SELECT timestamp FROM "public"."participants" WHERE "userid" = $1 AND surveyid = $2`);




//export module
module.exports.db = db; //db connection
module.exports.prpSql = prpSql; //prepared sql statements

