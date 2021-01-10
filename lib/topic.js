const template = require("./template");
const db = require("./db");
const url = require("url");
const qs = require("querystring");

exports.home = (req, res) => {
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
    let title = "Welcome";
    let description = "Hello, Node.js";
    let list = template.list(topics);
    let html = template.HTML(title, list, `<h2>${title}</h2>${description}`, `<a href="/create">create</a>`);
    res.writeHead(200);
    res.end(html);
  });
};

exports.page = (req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, (err, topics) => {
    if (err) throw err;
    db.query(
      `SELECT topic.id, topic.title, topic.description, topic.created, topic.author_id, author.name, author.profile FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?`,
      [queryData.id],
      (err2, topic) => {
        if (err2) throw err2;
        let title = topic[0].title;
        let list = template.list(topics);
        let html = template.HTML(
          title,
          list,
          `<h2>${title}</h2>
            ${topic[0].description}
            <p>by ${topic[0].name}</p>
            `,
          `<a href="/create">create</a>
            <a href="/update?id=${topic[0].id}">update</a>
            <form action="delete_process" method="post">
            <input type="hidden" name="id" value="${topic[0].id}">
            <input type="submit" value="delete">
            </form>`
        );
        res.writeHead(200);
        res.end(html);
      }
    );
  });
};

exports.create = (req, res) => {
  db.query(`SELECT * FROM topic`, (err, topics) => {
    if (err) throw err;
    db.query("SELECT * FROM author", (err2, authors) => {
      if (err2) throw err2;
      let title = "create";
      let list = template.list(topics);
      let html = template.HTML(
        title,
        list,
        `<form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                  <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                 ${template.authorSelect(authors)}
                </p>
                <p>
                  <input type="submit">
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
    db.query(
      `INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      (err, result) => {
        if (err) throw err;
        res.writeHead(302, { Location: `/?id=${result.insertId}` });
        res.end();
      }
    );
  });
};

exports.update = (req, res) => {
  const _url = req.url;
  const queryData = url.parse(_url, true).query;
  db.query("SELECT * FROM topic", (err, topics) => {
    if (err) throw err;
    db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], (err2, topic) => {
      if (err2) throw err2;
      db.query("SELECT * FROM author", (err3, authors) => {
        if (err3) throw err3;
        let list = template.list(topics);
        let html = template.HTML(
          topic[0].title,
          list,
          `<form action="/update_process" method="post">
                <input type="hidden" name="id" value="${topic[0].id}">
                <p><input type="text" name="title" placeholder="title" value="${topic[0].title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${topic[0].description}</textarea>
                </p>
                <p>
                  ${template.authorSelect(authors, topic[0].author_id)}
                </p>
                <p>
                  <input type="submit">
                </p>
                </form>`,
          `<a href="/create">create</a> <a href="/update?id=${topic[0].id}">update</a>`
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
    db.query(`UPDATE topic SET title=?, description=?, author_id=? WHERE id=?`, [post.title, post.description, post.author, post.id], (err, result) => {
      if (err) throw err;
      res.writeHead(302, { Location: `/?id=${post.id}` });
      res.end();
    });
  });
};

exports.delete_process = (req, res) => {
  let body = "";
  req.on("data", (data) => {
    body = body + data;
  });
  req.on("end", () => {
    let post = qs.parse(body);
    db.query(`DELETE FROM topic WHERE id=?`, [post.id], (err, result) => {
      if (err) throw err;
      res.writeHead(302, { Location: `/` });
      res.end();
    });
  });
};
