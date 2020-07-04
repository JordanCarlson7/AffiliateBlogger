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
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5000/visitor"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set("port", (process.env.PORT || 5000));
//----------------------------------SETUP
//ROUTES---------------------------------
app.get("/", function (req, res) {
    res.sendFile('public/html/welcomeStatic.html', { root: __dirname });
})
app.get("/visitor", showVisitorBlog);
app.get("/getUser", getUser);
app.get("/getBlog", getBlogs);
app.get("/getAffiliates", getAffiliates);
app.get("/getAttachments", getAttachments);
app.post('/addComment', addComment);
app.post('/deleteComment', deleteComment);
//--------------------------------ROUTES

//CODE----------------------------------------------------------------------------------------------------------------------------------------------
//GETS--------------------------------------
//SHOWING A VISITOR A BLOG
function showVisitorBlog(req, res) {
    //var author = 'nothing';

    getBlogsJoinUsersFromDb(1, async function (err, result) {

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
            //console.log("This is what we got", params)
            getComments(1, res, params);
            //res.render("homePage.ejs", params);
            //res.end();
        }
    })
}

//
async function getComments(id, res, blogParams) {
    console.log("trying to get comments");
    var sql = "SELECT author, content, date FROM comments WHERE comments.blog_id = $1::int";
    params = [id];
    pool.query(sql, params, function (err, result) {
        if (err || result == 'undefined') {
            console.log("error in DB");
            console.log(err);
            return null;
        }
        else {
            //console.log("DB Result" + JSON.stringify(result.rows));
            commentArray = result.rows;
            //console.log("all the parameters", blogParams);
            blogParams.commentsArray = commentArray;
            console.log(blogParams.commentsArray[0])
            // console.log(blogParams.commentsArray)
            res.render("homePage.ejs", blogParams);
            res.end();

        }
    })
}
//
//Pool:getBlogsJoinUsers
function getBlogsJoinUsersFromDb(id, callback) {

    console.log("getBlogsJOINUsersFromDb with id:", id);
    var sql = "SELECT user_name, title, subject, date, content FROM blogs JOIN users on blogs.user_id = $1::int AND users.id = $1::int";
    //?havent tried var sql ="SELECT user_name, title, subject, date, content, author, content, date FROM blogs JOIN users on blogs.user_id = $1::int AND users.id = $1::int JOIN comments ON comments.blog_id = blogs.id"
    var params = [id];

    try {
        pool.query(sql, params, function (err, result) {
            if (err || result == 'undefined') {
                console.log("error in DB");
                console.log(err);
                callback(err, null);
            }
            else {
                //console.log("DB Result" + JSON.stringify(result.rows));
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
function deleteComment(req, res) {
    console.log("request:", req.body)
    var name = req.body.commentName;
    var comment = req.body.commentContent;
    console.log(name, comment);
    console.log('Backend: received post from', req.url);
    console.log('data:', req.body)
    if (req.body != {}) {
        deleteCommentFromDb(name, comment, function (err, result) {
            if (err) {
                console.log("error in posting to db", err)

                res.header('content-type', 'application/json');
                res.status(200).send(JSON.stringify({ 'response': err }));
            }
            else {
                console.log("result of posting to db", result);
                res.header('content-type', 'application/json');
                res.status(200).send(JSON.stringify({ 'response': 'success' }));
            }
        });
    }

}
//Should have stored id_seq of comment in a data tag and used that for deletion condition
function deleteCommentFromDb(name, comment, callback) {
    var sql = "DELETE from comments WHERE comments.content = $1::text";
    var params = [comment];

    pool.query(sql, params, function (err, result) {
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


function addComment(req, res) {
    console.log("request:", req.body)
    var name = req.body.commentName;
    var comment = req.body.commentContent;
    console.log(name, comment);
    console.log('Backend: received post from', req.url);
    console.log('data:', req.body)
    if (req.body != {}) {
        addCommentToDb(name, comment, function (err, result) {
            if (err) {
                console.log("error in posting to db", err)
                res.header('content-type', 'application/json');
                res.status(200).send(JSON.stringify({ 'response': err }));
            }
            else {
                console.log("result of posting to db", result);
                res.header('content-type', 'application/json');
                res.status(200).send(JSON.stringify({ 'response': 'success' }));
            }
        });
    }


}
function addCommentToDb(name, comment, callback) {
    date = new Date();
    var sql = "INSERT INTO comments (blog_id, author, content, date) VALUES (1, $1::varchar, $2::text, $3::Date)";
    var params = [name, comment, date];

    pool.query(sql, params, function (err, result) {
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
