const { Pool } = require('pg')
var express = require('express');
var app = new express();


app.set("port", (process.env.PORT || 5000));
app.get("/", displayHomePage);

//----------
//Pooling
const connectionString = process.env.DATABASE_URL || "postgress://localtester:localpassword@localhost:5432/affiliate_blogger";
const pool = new Pool({connectionString: connectionString});

function displayHomePage(req, res) {
    console.log("Connected to the Homepage");


    var id =  req.query.id;
    getPersonFromDb(id, function (error, result) {
        if (error) {
            res(error);
        }
        else {
        console.log("back grom data base with result", result);
        res.json(result);
        }
    });
}

function getPersonFromDb(id, callback) {
    console.log("getPersonFromDb with id:", id);
    var sql = "SELECT * FROM users WHERE id = $1::int";
    var params = [id];

    pool.query(sql, params, function(err, result) {
        if (err) {
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
