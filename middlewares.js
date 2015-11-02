var moment = require('moment');

function getErrorCode(namespace, fieldname) {
    return namespace + '.' + fieldname
}

function check(opts) {
    return function (req, res, next) {
        for(var field in opts) {
            var regex = opts[field];

            req.check(field, getErrorCode('missing', field)).notEmpty();

            if(regex) {
                req.check(field, getErrorCode('invalid', field)).matches(regex);
            }
        }

        var errors = req.validationErrors();
        if (errors) {
            return res.status(400).json({
                errors: errors
            });
        }

        next();
    }
}

function signature(req, res, next) {
    return check({
        'signature': null,
        'date': /(Mon|Tue|...|Sun)\s(Jan|Feb|...|Dec)\s\d{2}\s\d{4}\s\d{2}:\d{2}:\d{2}\sGMT\+\d{2}:\d{2}/
    })(req, res, function () {

        var now = moment().utc();
        var date = moment(req.body.date, 'ddd MMM YYYY HH:mm:ss GMTZZ');

        console.log(now);
        console.log(date);

        console.log(Math.abs(moment().utc().diff(moment(req.body.date, 'ddd MMM YYYY HH:mm:ss GMTZZ'), 'minutes')));
        if(Math.abs(moment().utc().diff(moment(req.body.date, 'ddd MMM YYYY HH:mm:ss GMTZZ'), 'minutes')) > 10) {

            return res.status(400).json({
                errors: [
                    { code: 'expired.date', param: 'date' }
                ]
            });
        }

        next();
    });
};

module.exports = {
    check: check,
    signature: signature
};