var express = require('express');
var app = express();

var low = require('lowdb');
var storage = require('lowdb/file-async');
var db = low('db.json', { storage });

app.use(express.static(__dirname));
app.get("/address", function (req, res) {
    var post = db('address').filter(function (val) {
        return val.ParentId == req.query.id;
    });
    res.send(post);
});
var port = process.env.PORT || 3000;
app.listen(port);

console.log('Server started.  Running at http://localhost:' + port);