const express = require('express'),
mongoose = require('mongoose'),
app = express()

app.set('port', process.env.PORT || 3000)
app.use(express.json())

mongoose.connect("mongodb://localhost/user", {useUnifiedTopology:true, useNewUrlParser:true})
mongoose.connection.once('open', () => {console.log("DataBase is created. dbName = user")})
mongoose.Promise = global.Promise

const route = require('./routes/mainRoute')
app.use(route)

app.listen(app.get('port'), () => {
    console.log(`Server is running. Port: ${app.get('port')}`)
})