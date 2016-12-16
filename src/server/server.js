const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const formidable = require('formidable');
const readline = require('readline');
const encoding = require('encoding-japanese');
const iconv = require('iconv-lite');

/**
 * initial 設定
 * ポート3000を指定
 * post処理に、req.bodyがunderfindになるので、body-parserを利用
 * 指定したポートでリクエスト待機状態にする
 */
var app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.static('./'));
app.use(bodyParser());
app.listen(app.get('port'), function () {
  console.log('server listening on port :' + app.get('port'));
});

/**
 * クライアント側に対して一番最初にindex.htmlを返却
 */
app.get('/', function (req, res) {
  res.send('index.html');
});

/**
 * クライアント側でアップロードされたcsvファイルを、ローカルに保存する
 * その後csvファイルの中身を文字列として画面に返却
 */
app.post('/upload', function (req, res) {
  // ファイルの読み込み
  //var file = fs.readFileSync('./server/data/data.txt');
  //var oldFile = JSON.parse(file);
  const form = new formidable.IncomingForm();
  form.encoding = 'utf-8';
  form.uploadDir = './src/server/upload';
  form.parse(req, function (_, _, files) {
    const filePath = files.userfile.path;
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

/**
 * エラーが発生した場合
 */
app.use(function (err, req, res, next) {
  console.log(err.stack);
  res.status(500).send(err.message);
});
