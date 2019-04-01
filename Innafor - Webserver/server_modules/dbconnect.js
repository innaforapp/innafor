

const pgp = require('pg-promise')();
//db connect string
const db = pgp(process.env.DB_URL);

const PrpSt = require('pg-promise').PreparedStatement;
const prpSql = {};

//User-----------------
prpSql.regUser = new PrpSt('regUser',`INSERT INTO "public"."brukere" ("brukerid", "navn", "epost", "gruppe", "rolle", "hash") VALUES (DEFAULT, $1, $2, $3, $4, $5)`);

prpSql.findUser = new PrpSt('findUser', `SELECT * FROM "public"."brukere" WHERE epost = $1`);

prpSql.updateUser = new PrpSt('updateUser', `UPDATE "public"."brukere" SET $2=$3 WHERE epost = $1`);

prpSql.existingUser = new PrpSt('existingUser', `SELECT * FROM "public"."brukere" WHERE epost=$1 OR navn=$2`);


//survey--------------
prpSql.addCategory = new PrpSt('addCategory',`INSERT INTO "public"."questioncategory" ("id", "category", "active") VALUES (DEFAULT, $1, DEFAULT)`);
prpSql.getCategory = new PrpSt('getCategory', `SELECT * FROM "public"."questioncategory" WHERE "active" = 'true' `)

prpSql.addQuestion = new PrpSt('addQuestion',`INSERT INTO "public"."questionpool" ("id", "question", "category", "agegroup", "type", "weight", "active") VALUES (DEFAULT, $1, $2, $3, $4, $5, DEFAULT)`);
prpSql.getQuestions = new PrpSt('getQuestions', `SELECT * FROM "public"."questionpool" WHERE "active" = 'true' `)
prpSql.deleteQuestion = new PrpSt('deleteQuestion', `UPDATE "public"."questionpool" SET "question" = '-', "category" = '-', "active" = 'false' WHERE "id" = $1`)
prpSql.deleteCategory = new PrpSt('deleteCategory', `UPDATE "public"."questioncategory" SET "category" = '-', "active" = 'false' WHERE "id" = $1`)
prpSql.deleteQuestions = new PrpSt('deleteQuestions', `UPDATE "public"."questionpool" SET "question" = '-', "category" = '-', "active" = 'false' WHERE "category" = $1`)

//export module
module.exports.db = db; //db connection
module.exports.prpSql = prpSql; //prepared sql statements

