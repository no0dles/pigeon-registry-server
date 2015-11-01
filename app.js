var express = require('express');
var app = express();

var thinky = require('thinky');

var db = thinky({
    db: "pigeon",
    host: "db"
});

var Post = db.createModel("Post", {
    id: String,
    title: String,
    content: String
});

var router = express.Router();

router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

app.get('/', function (req, res, next) {
    Post.get('test')
        .then(function (user) {
            res.json(user);
        })
        .catch(db.Errors.DocumentNotFound, function() {
            res.sendStatus(404);
        })
        .error(function(error) {
            next(error);
        });
});

app.use('/api', router);

module.exports = app;