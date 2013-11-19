var express = require('express');
var fs = require('fs');
var app = express();
var exec = require('child_process').exec;

function execute(command){
    exec(command, function(error, stdout, stderr){ console.log(stdout); });
};

app.use(express.logger());
app.use(express.static(__dirname + '/www'));

app.get('/', function(request, response) {
    var content = fs.readFileSync('index.html').toString('utf-8');
    response.send(content);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
    console.log("Listening on " + port);
});
