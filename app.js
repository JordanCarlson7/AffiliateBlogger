//SETUP---------------------------------
const { Pool } = require('pg')
var express = require('express');
var path = require('path');
const bcrypt = require('bcrypt');

var app = new express();
const connectionString = process.env.DATABASE_URL || "postgress://localtester:localpassword@localhost:5432/affiliate_blogger";
const pool = new Pool({ connectionString: connectionString });
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:5000/visitor"); 
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
//---Globals--//
var currentBlogId = 0;
var blogsArray = [];
//---Globals--//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'))
app.set("port", (process.env.PORT || 5000));
//----------------------------------SETUP
//ROUTES---------------------------------
app.get("/", function (req, res) {
    res.sendFile('public/html/welcomeStatic.html', { root: __dirname });
    getBlogs();
})
app.get("/visitor", showVisitorBlog);
app.get("/getUser", getUser);
app.get("/getBlog", getBlogs);
app.get("/getAffiliates", getAffiliates);
app.get("/getAttachments", getAttachments);
app.post('/addComment', addComment);
app.post('/deleteComment', deleteComment);
app.post('/newUser', addUser);
app.post('/login', login);
//app.post('/login', )
//--------------------------------ROUTES

//CODE----------------------------------------------------------------------------------------------------------------------------------------------
//GETS--------------------------------------
//SHOWING A VISITOR A BLOG
function showVisitorBlog(req, res) {
    //var author = 'nothing';
    console.log("query", req.query);
    var user_id = req.query.id || 1; 
    getBlogsJoinUsersFromDb(user_id, async function (err, result) {

        if (err) {
            console.log("getBlogs From ERR", err);
        }
        else {

            //console.log("RESULT WAS", result);
            var content = result[0].content;
            console.log("result", result);
            var params = {
                author: result[0].user_name,
                title: result[0].title,
                subject: result[0].subject,
                date: result[0].date,
                content: content,
                blogs: blogsArray
            }
            //console.log("This is what we got", params)
            getComments(result[0].id, res, params);
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
    console.log("previous current blog", currentBlogId);
    currentBlogId = id;
    console.log("getBlogsJOINUsersFromDb with id:", id);
    var sql = "SELECT blogs.id, blogs.title, blogs.subject, blogs.date, blogs.content, users.user_name FROM blogs JOIN users ON blogs.id = $1::int AND blogs.user_id = users.id";
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
function getBlogs() {
    console.log("Connected to GET BLOG");

        getBlogsFromDb(function (error, result) {
            if (error || result == null || result.length == 0) {
               
            }
            else {
                console.log("back from data base with result", result);
            }
        });
}
//Pool:getBlogs
function getBlogsFromDb(callback) {

    console.log("getBlogsFromDb");
    var sql = "SELECT user_id, title FROM blogs";
    //var sql = "SELECT user_id, title FROM blogs WHERE id = $1::int";
    //var params = [id];

    try {
        pool.query(sql, function (err, result) {
            if (err || result == 'undefined') {
                console.log("error in DB");
                console.log(err);
                callback(err, null);
            }
            else {
                console.log("DB Result" + JSON.stringify(result.rows));
                callback(null, result.rows);
                blogsArray = result.rows;
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
    var sql = "INSERT INTO comments (blog_id, author, content, date) VALUES ($1::int, $2::varchar, $3::text, $4::Date)";
    var params = [currentBlogId, name, comment, date];

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
//Adding user-----------------------------------------------------------
function addUser(req, res) {
    console.log(req.body);
    const saltRounds = 10;
    var stuff;
    try {
        /*start salting */
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) {
                console.log("prehash error", err);
            } else {
                /*create hash */
                bcrypt.hash(req.body.password, salt, function (err, hash) {
                    if (err) {
                        console.log("hashing error", err);
                    } else {
                        params = {
                            username: req.body.username,
                            password: hash,
                            email: req.body.email
                        }
                        console.log("params", params);
                        stuff = params;
                        console.log("new user: ", stuff);
                        /*Send to DB */
                        addUserToDb(stuff, function (err, result) {
                            if (err || params === 'undefined') {
                                console.log("error in adding user", err);
                                res.status(400).send(JSON.stringify({ 'error': err }));
                            } else {
                                console.log('success adding user');
                                res.status(204).send(JSON.stringify(result.rows));
                            }
                        })
                    }
                })

            }
        })
    }
    catch (err) {
        console.log("promise error", err)
    }




}
function addUserToDb(data, callback) {
    console.log('data', data)
    var sql = "INSERT INTO users (user_name, password, email) VALUES ($1::varchar, $2::varchar, $3::varchar)"
    var params = [data.username, data.password, data.email];
    pool.query(sql, params, function (err, result) {
        if (err) {
            console.log('AddUser, DB error', err);
            callback(err, null);
        } else {
            console.log("add user success");
            callback(null, result.rows);
        }
    })

}
//-------------------------------------------------------------------Adding user
//LOGIN---------------------------------------------------------------------
function login(req, res) {
    
}
function validateLogin(params, callback) {

}
//-------------------------------------------------------------------LOGIN

//-------------------------------------------------------------------POST
//LocalHost Listening 5000
app.listen(app.get("port"), function () {
    console.log("Listening on port:" + app.get("port"));
});
