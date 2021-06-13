const mysql = require('mysql')
const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth.js')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
})

router.post('/', (req, res, next) => {
    var sql = `SELECT * FROM users`
    con.query(sql, function (err, result) {
        if (result.length > 0){
            auth(req, res, next)
        }
        else{
            next()
        }
    })
}, (req, res) => {
    var sql = `SELECT * FROM users WHERE username = "${req.body.username}"`
    con.query(sql, function (err, result) {
        if (result.length == 1){
            console.log("can't add user, this username is already taken")
            res.send("can't add user, this username is already taken")
        }
        else{
            var sql = `INSERT INTO users (username, password) VALUES ("${req.body.username}", "${req.body.password}")`
            con.query(sql, function (err, result) {
                if (err) throw err
                console.log("1 record inserted")
                res.json({id: result.insertId, username: req.body.username})
            })
        }
    })
})

router.get('/', auth, (req, res) => {
    var sql = "SELECT * FROM users"
    con.query(sql, function (err, result) {
        res.send(result)
    })
})

router.delete('/:id', auth, (req, res) => {
    var sql = `SELECT * FROM users`
    con.query(sql, function (err, result) {
        if (result.length == 1){
            console.log("can't delete, only 1 user in this database")
            res.send("can't delete, only 1 user in this database")
        }
        else{
            var sql = `DELETE FROM users WHERE id = ${req.params.id}`
            con.query(sql)
            console.log("1 record deleted")
            res.end()
        }
    })
})

module.exports = router