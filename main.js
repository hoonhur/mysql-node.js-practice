var http = require("http");
var url = require("url");
const topic = require("./lib/topic");

var app = http.createServer((req, res) => {
  var _url = req.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;
  if (pathname === "/") {
    if (queryData.id === undefined) {
      topic.home(req, res);
    } else {
      topic.page(req, res);
    }
  } else if (pathname === "/create") {
    topic.create(req, res);
  } else if (pathname === "/create_process") {
    topic.create_process(req, res);
  } else if (pathname === "/update") {
    topic.update(req, res);
  } else if (pathname === "/update_process") {
    topic.update_process(req, res);
  } else if (pathname === "/delete_process") {
    topic.delete_process(req, res);
  } else {
    res.writeHead(404);
    res.end("Not found");
  }
});
app.listen(3000);
