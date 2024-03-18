const db = require('./../db.js')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const register = (req, res) => {
    const q = 'SELECT * FROM user WHERE username = ? OR email = ?'

    db.query(q, [req.body.username, req.body.email], (err, data) => {
        if (err) return res.json(err)
        if (data.length) return res.status(409).json('User already exists')

        // HASH THE PASSWORD AND CREATE USER
        const salt = bcrypt.genSaltSync(10)
        const hash = bcrypt.hashSync(req.body.password, salt)

        const insertQuery = "INSERT INTO user(username, email, password) VALUES (?, ?, ?)";
        const values = [
            req.body.username,
            req.body.email,
            hash
        ]
        db.query(insertQuery, values, (err, result) => {
            if (err) return res.status(500).json(err)
            return res.status(200).json("User has been created")
        })
    })
}

const login = (req, res) => {
    const q = "SELECT * FROM user WHERE username = ?"

    db.query(q, [req.body.username], (err, data) => {
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json("User not found")

        // CHECK PASSWORD
        const isPasswordCorrect = bcrypt.compareSync(req.body.password, data[0].password)
        if (!isPasswordCorrect) return res.status(400).json("Wrong username or Password")

        const token = jwt.sign({id: data[0].id }, "3m2i13ip21dlsa")
        const { password, ...other } = data[0]

        // Configure o cookie após o middleware cookie-parser
        res.cookie("access_token", token,{
            httpOnly: true,
            maxAge: 900000,
            sameSite: "none",
            secure: false
        }).status(200).json(other)
    })
}

const logout = (req, res) => {
    res.clearCookie("access_token", {
      sameSite:"none",
      secure:true
    }).status(200).json("User has been logged out.")
};

module.exports = {
    register, login, logout
}
