const express = require('express')
const app = express()

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./database.db');

var port = process.env.PORT || 80;

db.serialize(function() {
    db.run("CREATE TABLE if not exists votes (name TEXT, uid TEXT PRIMARY KEY, votefor TEXT)");
    var stmt = db.prepare("INSERT INTO votes VALUES (?,?,?)");

//    stmt.run("test paramter");
    stmt.finalize();

   db.each("SELECT path FROM votes", function(err, row) {
    });
});

app.use(express.static('public'))

app.get('/vote/:data', function (req, res) {
	var x = req.params.data;
	res.send('thanks');
	var decoded = new Buffer(x, 'base64').toString('ascii')
	console.log(decoded);
var xxd = decoded.split("//");
var namee = "'" + xxd[2] + "'";
var uidd = "'" + xxd[1] + "'";
var votee = "'" + xxd[0] + "'";

var sqlQueryIns = 'INSERT OR IGNORE INTO votes(name,uid,votefor) VALUES ' +  '(' + namee + ',' + uidd + ',' + votee + ')' + '';

db.run(sqlQueryIns);

})
app.get("/", function(req, res) {
res.send("<html><center><h1><i>AadharVote Server doing it's magic here ♥</i></h1></center></html>");
})
app.get("/dynamic", function(req, res) {

var posts = [];
db.serialize(function() {
    db.each("SELECT * FROM votes", function(err, row) {
        posts.push({Name: row.name, uid: row.uid, votingFor: row.votefor})
    }, function() {
        // All done fetching records, render response
        res.send({title: "Dynamic", posts: posts})
    })
})
})

app.listen(port, function () {
  console.log('adhaarVote server running on port, %s!',port)
})
