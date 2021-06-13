const mysql = require('mysql');
const express = require('express')
const router = express.Router()

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
});

router.post('/', (req, res) => {
    var sql = `INSERT INTO todo (deskripsi) VALUES ("${req.body.deskripsi}")`
	con.query(sql, function (err, result) {
        if (err) throw err
        console.log("1 record inserted")
        res.json({id: result.insertId, deskripsi: req.body.deskripsi})
    });
})

router.get('/', (req, res) => {
    var sql = "SELECT * FROM todo"
    con.query(sql, function (err, result) {
        res.send(result)
    })
})

router.delete('/:id', (req, res) => {
    var sql = `DELETE FROM todo WHERE id = ${req.params.id}`
    con.query(sql, function (err, result) {
        if (err) throw err
        console.log("1 record deleted")
        res.end()
    })
})

module.exports = router