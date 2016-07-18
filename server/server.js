//var test = require('./controllers/Get');

var express = require('express');
var app = express();
var fs = require('fs');
var DATA_FILE = './data/data.txt';
var bodyParser = require('body-parser');

//ポートの指定
app.set('port', process.env.PORT || 3000);

app.use(express.static('./'));

// post処理時に、req.bodyがundefinedになるため、body-parserが必要。
app.use(bodyParser());

app.get('/', function (req, res) {
  res.send('index.html');
});

app.get('/data', function (req, res) {
  var file = fs.readFileSync('./server/data/data.txt');
  res.json(JSON.parse(file));
});

app.post('/upload', function (req, res) {
  var file = fs.readFileSync('./server/data/data.txt');
  var oldFile = JSON.parse(file);
  var newData = {
    name: req.body.name,
    ids: req.body.ids
  };
  oldFile.push(newData);
  res.status(200).send('OK牧場');
});

//ルートパスの指定
//var clientPath = __dirname.replace("/server", "/client");
//app.use('/', express.static(clientPath));

//app.get('/', function(req, res) {
//  res.send('hello world');
//});

//エラーが発生した場合の指定
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send(err.message);
});

//指定したポートでリクエスト待機状態にする
app.listen(app.get('port'), function () {
  console.log('server listening on port :' + app.get('port'));
});
