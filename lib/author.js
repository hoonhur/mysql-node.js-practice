const template = require("./template");
const db = require("./db");
const qs = require("querystring");
const url = require("url");

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
        </style>
        <form action='/author/create_process' method='post'>
            <p>
                <input type="text" name="name" placeholder="name">
            </p>
            <p>
                <textarea name="profile" placeholder="profile"></textarea>
            </p>
            <p>
                <input type="submit" value="create">
            </p>
        </form>
        `,
        ``
      );
      res.writeHead(200);
      res.end(html);
    });
  });
};

exports.create_process = (req, res) => {
  let body = "";
  req.on("data", (data) => (body = body + data));
  req.on("end", () => {
    let post = qs.parse(body);
    db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [post.name, post.profile], (err, result) => {
      if (err) throw err;
      res.writeHead(302, { Location: `/author` });
      res.end();
    });
  });
};

exports.update = (req, res) => {
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
    db.query("SELECT * FROM author", (err2, authors) => {
      if (err2) throw err2;
      const _url = req.url;
      const queryData = url.parse(_url, true).query;
      db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], (err3, author) => {
        if (err3) throw err3;
        let title = "author update";
        let list = template.list(topics);
        let html = template.HTML(
          title,
          list,
          `${template.authorTable(authors)}
            <style>
                table {border-collapse: collapse;}
                td {border: 1px solid black;}
            </style>
            <form action='/author/update_process' method='post'>
                <p><input type="hidden" name="id" value="${queryData.id}"></P>
                <p><input type="text" name="name" placeholder="name" value="${author[0].name}"></p>
                <p><textarea name="profile" placeholder="profile">${author[0].profile}</textarea></p>
                <p><input type="submit" value="update"></p>
            </form>
            `,
          ``
        );
        res.writeHead(200);
        res.end(html);
      });
    });
  });
};

exports.update_process = (req, res) => {
  let body = "";
  req.on("data", (data) => (body = body + data));
  req.on("end", () => {
    let post = qs.parse(body);
    db.query(`UPDATE author set name=?, profile=? WHERE id=?`, [post.name, post.profile, post.id], (err, result) => {
      if (err) throw err;
      res.writeHead(302, { Location: `/author` });
      res.end();
    });
  });
};

exports.delete_process = (req, res) => {
  let body = "";
  req.on("data", (data) => (body = body + data));
  req.on("end", () => {
    let post = qs.parse(body);
    db.query(`DELETE FROM topic where author_id=?`, [post.id], (err1, result1) => {
      if (err1) throw err1;
      db.query(`DELETE FROM author WHERE id=?`, [post.id], (err2, result2) => {
        if (err2) throw err2;
        res.writeHead(302, { Location: `/author` });
        res.end();
      });
    });
  });
};
