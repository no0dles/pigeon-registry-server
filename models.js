var config = require('config');
var thinky = require('thinky')({
    db: config.get('rethinkdb.name'),
    host: config.get('rethinkdb.host')
});

var type = thinky.type;

module.exports.User = thinky.createModel("User", {
    username: type.string(),
    avatar: {
        eyes: type.string(),
        nose: type.string(),
        mouth: type.string(),
        color: type.string()
    },
    key: type.string(),
    signature: type.string(),
    date: type.date(),
    validity: type.number()
}, {
    pk: "username"
});

module.exports.Errors = thinky.Errors;