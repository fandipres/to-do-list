const mysql = require('mysql')

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "todo"
})

module.exports = function(req, res, next){
    const username = req.headers.username
    const password = req.headers.password

    var sql = `SELECT username FROM users WHERE username = "${username}" AND password = "${password}"`;
    con.query(sql, function (err, result) {
        if (result.length > 0){
            next()
        }
        else{
            res.send(401)
        }
    })
}