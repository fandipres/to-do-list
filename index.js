const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors');

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
});

app.get('/', (req, res) => {
    res.send(`
        <html>
            <body>
                <form action="/todo" method="post">
                <input name="deskripsi"/>
                <button>Add</button>
            </form>
            </body>
        </html>`)
})

app.post('/todo', (req, res) => {
    var sql = "INSERT INTO todo (deskripsi) VALUES ('" + req.body.deskripsi + "')";
    con.query(sql)
    res.end()
})

app.get('/todo', (req, res) => {
    var sql = "SELECT deskripsi FROM todo";
    var data = ""
    con.query(sql, function (err, result) {
        result.forEach((item) => {
            data += `<div>` + item.deskripsi + `</div>`
        });
        res.send(data)
        res.end();
    })
})

app.listen(3000)