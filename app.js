const { Pool } = require('pg')
var express = require('express');
const { response } = require('express');
var app = new express();


app.set("port", (process.env.PORT || 5000));
app.get("/", displayHomePage);

//----------
//Pooling
const connectionString = process.env.DATABASE_URL || "postgress://localtester:localpassword@localhost:5432/affiliate_blogger";
const pool = new Pool({connectionString: connectionString});

function displayHomePage(req, res) {
    console.log("Connected to the Homepage");

if (req.query.id) {
    var id =  req.query.id;
    getPersonFromDb(id, function (error, result) {
        if (error || result == null || result.length != 1) {
            response.status(500).json({data: error});


        }
        else {
        console.log("back grom data base with result", result);
        res.json(result[0]);
        }
    });
}
else {
    console.log("no query");
}
    
}

function getPersonFromDb(id, callback) {

    console.log("getPersonFromDb with id:", id);
    var sql = "SELECT * FROM users WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function (err, result) {
        if (err || result === 'undefined') {
            console.log("error in DB");
            console.log(err);
            callback(err, null);
        }
        else {
        console.log("DB Result" + JSON.stringify(result.rows));
        callback(null, result.rows); 
        }
    })
}

app.listen(app.get("port"), function() {
    console.log("Listening on port:" + app.get("port"));
});
