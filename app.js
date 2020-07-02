//SETUP---------------------------------
const { Pool } = require('pg')
var express = require('express');
var path = require('path');
const { response } = require('express');
const { nextTick } = require('process');
var app = new express();
const connectionString = process.env.DATABASE_URL || "postgress://localtester:localpassword@localhost:5432/affiliate_blogger";
const pool = new Pool({ connectionString: connectionString });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.set("port", (process.env.PORT || 5000));
//----------------------------------SETUP
//ROUTES---------------------------------
app.get("/", function (req, res) {
    res.sendFile('public/html/welcomeStatic.html', {root: __dirname});
})
app.get("/visitor", showVisitorBlog);
app.get("/getUser", getUser);
app.get("/getBlog", getBlogs);
app.get("/getAffiliates", getAffiliates);
app.get("/getAttachments", getAttachments);
app.use('/visitor', addComment);
//--------------------------------ROUTES

//CODE----------------------------------------------------------------------------------------------------------------------------------------------
//GETS--------------------------------------
//SHOWING A VISITOR A BLOG
function showVisitorBlog(req, res) {
    //var author = 'nothing';

    getBlogsJoinUsersFromDb(1, function (err, result) {
        if (err) {
            console.log("getBlogs From ERR", err);
        }
        else {
            //console.log("RESULT WAS", result);
            var content = result[0].content;

            var params = {
                author: result[0].user_name,
                title: result[0].title,
                subject: result[0].subject,
                date: result[0].date,
                content: content
            }
            res.render("homePage.ejs", params);
            res.end();
        }
    })
}
//Pool:getBlogsJoinUsers
function getBlogsJoinUsersFromDb(id, callback) {

    console.log("getBlogsJOINUsersFromDb with id:", id);
    var sql = "SELECT user_name, title, subject, date, content FROM blogs JOIN users on blogs.user_id = $1::int AND users.id = $1::int";
    var params = [id];

    try {
        pool.query(sql, params, function (err, result) {
            if (err || result == 'undefined') {
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
    catch (err) {
        console.log("Attempted connection but...", err);
        callback(err, null);
    }
}
//-------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------
//GETTING THE USER
//getUser
function getUser(req, res) {
    console.log("Connected to GET USER");

    if (req.query.id) {
        var id = req.query.id;
        getPersonFromDb(id, function (error, result) {
            if (error || result == null || result.length != 1) {
                res.status(500).json({ data: error });
            }
            else {
                console.log("back grom data base with result", result);
                res.json(result[0]);
            }
        });
    }
    else {
        console.log("incorrect query");
        res.json({ query: req.query });
    }
}
//Pool:getUser
function getPersonFromDb(id, callback) {

    console.log("getPersonFromDb with id:", id);
    var sql = "SELECT * FROM users WHERE id = $1::int";
    var params = [id];

    try {
        pool.query(sql, params, function (err, result) {
            if (err || result == 'undefined') {
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
    catch (err) {
        console.log("Attempted connection but...", err);
        callback(err, null);
    }
}
//---------------------------------------------------------------------------------------------------

//GETTING BLOGS
function getBlogs(req, res) {
    console.log("Connected to GET BLOG");

    if (req.query.id) {
        var id = req.query.id;
        getBlogsFromDb(id, function (error, result) {
            if (error || result == null || result.length == 0) {
                res.status(500).json({ data: error });
            }
            else {
                console.log("back grom data base with result", result);
                res.json(result);
            }
        });
    }
    else {
        console.log("incorrect query");
        res.json({ query: req.query });
    }
}
//Pool:getBlogs
function getBlogsFromDb(id, callback) {

    console.log("getBlogsFromDb with id:", id);
    var sql = "SELECT * FROM blogs WHERE id = $1::int";
    var params = [id];

    try {
        pool.query(sql, params, function (err, result) {
            if (err || result == 'undefined') {
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
    catch (err) {
        console.log("Attempted connection but...", err);
        callback(err, null);
    }
}
//-------------------------------------------------------------------------------------------------------------

//GET AFFILIATES
//getAffiliates
function getAffiliates(req, res) {
    console.log("Connected to GET AFFILIATES");

    if (req.query.id) {
        var id = req.query.id;
        getAffiliatesFromDb(id, function (error, result) {
            if (error || result == null || result.length == 0) {
                res.status(500).json({ data: error });
            }
            else {
                console.log("back grom data base with result", result);
                res.json(result);
            }
        });
    }
    else {
        console.log("incorrect query");
        res.json({ query: req.query });
    }
}
//Pool:getAffiliates
function getAffiliatesFromDb(id, callback) {

    console.log("getAffiliatesFromDb with id:", id);
    var sql = "SELECT * FROM affiliates WHERE user_id = $1::int";
    var params = [id];

    try {
        pool.query(sql, params, function (err, result) {
            if (err || result == 'undefined') {
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
    catch (err) {
        console.log("Attempted connection but...", err);
        callback(err, null);
    }
}
//------------------------------------------------------------------------------------------

//GET ATTACHMENTS
//getAttatchments
function getAttachments(req, res) {
    console.log("Connected to GET ATTACHMENTS");

    if (req.query.id) {
        var id = req.query.id;
        getAttachmentsFromDb(id, function (error, result) {
            if (error || result == null || result.length == 0) {
                res.status(500).json({ data: error });
            }
            else {
                console.log("back grom data base with result", result);
                res.json(result);
            }
        });
    }
    else {
        console.log("incorrect query");
        res.json({ query: req.query });
    }
}
//Pool:getAttachments
function getAttachmentsFromDb(id, callback) {

    console.log("getAttachmentsFromDb with id:", id);
    var sql = "SELECT * FROM attachments WHERE blog_id = $1::int";
    var params = [id];

    try {
        pool.query(sql, params, function (err, result) {
            if (err || result == 'undefined') {
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
    catch (err) {
        console.log("Attempted connection but...", err);
        callback(err, null);
    }
}
//---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------GETS
//POST------------------------------------------------------------------------
function addComment(req, res) {
    var comment = req.body.commentName;
    var name = req.body.commentInput;
    console.log(comment, name);
    console.log('Backend: received post from', req.url);
    console.log('data:', req.body)
    if (req.body != {}) {
        addCommentToDb(name, comment, function(err, result) {
            if (err) {
                console.log("error in posting to db", err)
            }
            else {
                console.log("result of posting to db", result);
            }
        });
    }

    res.status(204).send();

}
function addCommentToDb(name, comment, callback){
    date = new Date();
    var sql = "INSERT INTO comments (blog_id, author, content, date) VALUES (1, $1::varchar, $2::text, $3::Date)";
    var params = [name, comment, date];

    pool.query(sql, params, function(err, result) {
        if (err) {
            console.log("error in db:", err);
            callback(err, null);
        }
        else {
            console.log("db response:", JSON.stringify(result.rows))
            callback(null, result.rows);
        }
    })
}
//-------------------------------------------------------------------POST
//LocalHost Listening 5000
app.listen(app.get("port"), function () {
    console.log("Listening on port:" + app.get("port"));
});
