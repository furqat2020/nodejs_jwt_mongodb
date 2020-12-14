const mongoose = require('mongoose'),
bcrypt = require('bcrypt')
const { Schema } = mongoose

let userSchema = new Schema({
    username: {type:String, required:true},
    access_token: {type:String, required:true},
    refresh_token: {type:String, required:true}
},
    {
        timestamps:true
    }
)

userSchema.pre('save', function(next){
    let user = this

    bcrypt.hash(user.refresh_token, 10)
    .then(hash => {
        user.refresh_token = hash
        next()
    })
    .catch(error => {
        console.log(error.message)
        next(error)
    })
})

module.exports = mongoose.model("User", userSchema)