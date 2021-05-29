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
    var sql = "SELECT * FROM todo";
    var data = ""
    con.query(sql, function (err, result) {
        res.send(result)
    })
})

app.delete('/todo/:id', (req, res) => {
    var sql = `DELETE FROM todo WHERE id = ${req.params.id}`;
	con.query(sql)
	res.end()
})

app.listen(3000)