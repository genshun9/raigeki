//var test = require('./controllers/Get');

var express = require('express');
var app = express();
//var fs = require('fs');
//var DATA_FILE = './data/data.txt';

//ポートの指定
app.set('port', process.env.PORT || 3000);

app.use(express.static('./'));

app.get('/', function (req, res) {
  res.send('index.html');
});

app.get('/data', function (req, res) {
  //return new Promise(function (resolve, reject) {
  //  fs.readFile(DATA_FILE, function (err, data) {
  //        if (err) {
  //          reject(err); // errがあればrejectを呼び出す
  //          return;
  //        }
  //        resolve(data); // errがなければ成功とみなしresolveを呼び出す
  //      })
  //      .then(data => {
  //        res.json(JSON.parse(data));
  //      })
  //});
  var data = [
    {"name": "raigeki", "ids": [10, 20, 30]},
    {"name": "sangan", "ids": [300, 400]}
  ];
  res.json(data);
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
