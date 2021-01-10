const template = require("./template");
const db = require("./db");

exports.home = (req, res) => {
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
    db.query("SELECT * FROM author", (err2, authors) => {
      if (err2) throw err2;
      let title = "author";
      let list = template.list(topics);
      let html = template.HTML(
        title,
        list,
        `${template.authorTable(authors)}
        <style>
            table {
                border-collapse: collapse;
            }
            td {
                border: 1px solid black;
            }
        </style>`,
        `<a href="/create">create</a>`
      );
      res.writeHead(200);
      res.end(html);
    });
  });
};
