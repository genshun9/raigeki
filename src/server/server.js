//var test = require('./controllers/Get');

var express = require('express');
var app = express();
var fs = require('fs');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var readline = require('readline');
var encoding = require('encoding-japanese');
var iconv = require('iconv-lite');

//ポートの指定
app.set('port', process.env.PORT || 3000);

app.use(express.static('./'));

// post処理時に、req.bodyがundefinedになるため、body-parserが必要。
app.use(bodyParser());

app.get('/', function (req, res) {
  res.send('index.html');
});

//app.get('/data', function (req, res) {
//  ローカル内のファイルを取得して画面に返却するメソッド
//  var file = fs.readFileSync('./server/data/data.txt');
//  res.json(JSON.parse(file));
//});

app.post('/upload', function (req, res) {
  // ファイルの読み込み
  //var file = fs.readFileSync('./server/data/data.txt');
  //var oldFile = JSON.parse(file);

  // ローカル内にcsvファイルを一旦保存。
  const form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = './src/server/upload';
  form.parse(req, function (_, _, files) {
    var filePath = files.userfile.path;
    fs.readFile(`./${filePath}`, 'utf-8', function (err, text) {
      // TODO: 文字化け解消に取り組んだ痕跡を残す（選択したcsvファイルの文字化け問題は解消していない）
      //var iconv = new Iconv('UTF-8', 'Shift_JIS//TRANSLIT//IGNORE');
      //var shift_jis_text = iconv.convert(text);
      //var TEST = encoding.convert(text, 'SJIS', 'UNICODE');
      //console.log("test", TEST);
      //console.log("detect", encoding.detect(TEST));
      //if(encoding.detect(text) === 'UNICODE') {
      //  console.log(iconv.encode(text, 'SHIFT-JIS'));
      //  res.writeHead(200, {'content-type': 'application/json; charset=shift-jis'});
      //}
      res.send(iconv.encode(text, 'SHIFT-JIS'));
    });
  });
});


//エラーが発生した場合の指定
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send(err.message);
});

//指定したポートでリクエスト待機状態にする
app.listen(app.get('port'), function () {
  console.log('server listening on port :' + app.get('port'));
});
