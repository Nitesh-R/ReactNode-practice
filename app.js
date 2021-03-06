var express = require("express");
var session = require('express-session');

var path = require("path");
var bodyParser = require("body-parser");
var user = require('./user');
var post = require('./post');


var app = express();

app.use(session({
    secret: 'my-secret',
    resave: true,
    saveUninitialized: false
}))
var sessions;

app.use(express.static(path.join(__dirname,"/html")));

app.use(bodyParser.json());


//listening
app.listen(7777,function(){
    console.log("started listning on port", 7777);
})

//api methods
app.get('/', function(req,res){
    res.sendFile(__dirname + '/html/index.html');
  })

app.get('/home', function(req,res){
    if(sessions && sessions.username){
        res.sendFile(__dirname + '/html/home.html');
    }else{
        res.send('unauthorized');
    }
})

app.post('/signin', function(req,res) {
    sessions = req.session;
    var user_name=req.body.email;
    var password= req.body.password;
    user.validateSignIn(user_name, password, function(result){
        if(result){

            sessions.username = user_name;
            console.log(sessions.username)
            res.send('success')
        }else{
            res.send('Wrong username and password combination')
        }
    })
});

app.post('/signup', function(req,res){
    var name=req.body.name;
    var email=req.body.email;
    var password=req.body.password;

    if(name && email && password){
        user.signup(name,email,password)
    }else{
        res.send('failure')
    }

})

app.post('/addpost', function(req,res){
    var title = req.body.title;
    var subject = req.body.subject;
    var tag = req.body.tag;
    var id = req.body.id;
    var user = sessions.username;
    if(id == '' || id == undefined){
    post.addPost(title, subject, tag, user, function(result){
        res.send(result);
    })}else{
        post.updatePost(id, title, subject, tag, function(result) {
            res.send(result);
        });
    }
})

app.post('/getpost', function(req,res){
    post.getPost(function(result){
        res.send(result);
    })
})

app.post('/getPostWithId', function(req, res){
    var id = req.body.id;
    post.getPostWithId(id, function(result){
        res.send(result)
    })
})

app.post('/deletePost', function(req, res){
    var id = req.body.id;
    post.deletePost(id, function(result){
        res.send(result)
    })
})

app.post('/getProfile', function(req,res){
    user.getUserInfo(sessions.username, function(result){
        res.send(result)
    })
})

app.post('/updateProfile', function(req,res){
    var name = req.body.name;
    var password = req.body.password;

    user.updateProfile(name, password, sessions.username, function(result){
        res.send(result);
    })
})

app.post('/addTag', function(req,res){
    var tag = req.body.tag;
    post.addTag(tag, function(result){
        res.send(result);
    })
})

app.post('/gettag', function(req, res){
    post.getTag(function(result){
        res.send(result);
    });
})