

const pgp = require('pg-promise')();
//db connect string
const db = pgp(process.env.DB_URL);

const PrpSt = require('pg-promise').PreparedStatement;
const prpSql = {};

//User-----------------
prpSql.regUser = new PrpSt('regUser',`INSERT INTO "public"."brukere" ("brukerid", "navn", "epost", "gruppe", "rolle", "hash") VALUES (DEFAULT, $1, $2, $3, DEFAULT, $4)`);

prpSql.findUser = new PrpSt('findUser', `SELECT * FROM "public"."brukere" WHERE epost = $1`);

//export module
module.exports.db = db; //db connection
module.exports.prpSql = prpSql; //prepared sql statements
