const User = require('../models/userModel'),
jwt = require('jsonwebtoken'),
bcrypt = require('bcrypt')

require('dotenv').config()

module.exports = {
    signup: (req, res) => {

        const username = req.body.username
        const user = {name: username}

        const accessToken = generateAccessToken(user)
        const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)

        let n_user = new User()
        n_user.username = username
        n_user.access_token = accessToken
        n_user.refresh_token = refreshToken

        n_user.save()
        .then(item => {
            console.log(`${item.username} user is created!`)
            res.json({item})
        })
        .catch(error => console.log(error))

        function generateAccessToken(user){
            return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'})
        }
    },

    check_auth: (req, res) => {
        User.findOne({"username":req.user.name})
        .then(item => res.json(item))
        .catch(error => res.sendStatus(401))
    },

    authenticateToken: (req, res, next) => {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(" ")[1]

        if(token == null) return res.sendStatus(401)

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if(err) return res.sendStatus(403)

            req.user = user
            next()
        })
    },

    refToken: (req, res) => {
        const refreshToken = req.body.token

        if(refreshToken == null) return res.sendStatus(401)

        User.findOne({refresh_token:refreshToken})
        .then(item => {
            const accessToken = jwt.sign({name: item.username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '60s'})
            res.json({accessToken})                   
        })
        .catch(error => console.log(error))
    }
}