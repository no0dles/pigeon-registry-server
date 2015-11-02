var config = require('config');
var thinky = require('thinky')({
    db: config.get('db_name'),
    host: config.get('db_host')
});

var type = thinky.type;

var User = thinky.createModel("User", {
    username: type.string(),
    avatar: {
        eyes: type.string(),
        nose: type.string(),
        mouth: type.string(),
        color: type.string()
    },
    key: type.string(),
    signature: type.buffer(),
    date: type.date()
}, {
    pk: "username"
});

module.exports = {
    User: User,
    Errors: thinky.Errors
};