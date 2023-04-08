// Require the database connection
const dbConnect = require("./backend/dbConnect")
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken")
const auth = require("./auth");
const User  = require("./backend/userDBModel");


const app = express()
app.use(cors())
app.use(express.json())

// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });

app.post('/register', (req, res) => {
    var name = req.body.name
    var email = req.body.email
    const number = req.body.mobileNumber
    var password = req.body.password
    var passwordConfirm = req.body.passwordc

    if(number<6000000000 && number>10000000000)
    {
        res.json({
            status: "FAILED",
            alertMsg: "Invalid Mobile Number"
        })
    }
    else if(password!==passwordConfirm)
    {
        res.json({
            status: "FAILED",
            alertMsg: "Passwords do not match!!"
        })
    }
    else
    {
        bcrypt.hash(password,12)
        .then((hashedpw)=>{
            User.findOne({email: email})
            .then((savedUser) => {
                if(savedUser){
                    res.json({
                        status: "FAILED",
                        alertMsg: "User already exists with this email"
                    })
                }
                const user = new User({
                    name: name,
                    mobileNumber: number,
                    email: email,
                    password: hashedpw,
                })
                user.save()
                .then((user) => {
                    res.json({
                        status: "SUCCESS",
                        alertMsg: "Account successfully created!!",
                        userName : user.name,
                        userEmail: user.email 
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err)
            })
        })
    }
})

app.post("/login", (req, res) => {
    // First, check if that email exists
    User.findOne({email: req.body.email})
    .then((user) => {
        bcrypt.compare(req.body.password, user.password)
        .then((passwordCheck) => {
            if(!passwordCheck){
                res.json({
                    status: "FAILURE",
                    alertMsg: "Incorrect Password!!",
                })
                return
            }
            // create JWT token
            const token = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email,
            },
            "RANDOM-TOKEN",
            {expiresIn: "24h"}  
            )

            // return success response
            res.json({
                status: "SUCCESS",
                alertMsg: "Login Successful!!",
                userEmail: user.email,
                token,
            })
            return
        })
        .catch((error) => {
            res.json({
                status: "FAILURE",
                message: "",
            })
            return
        })
    })
    .catch((e) => {
        res.json({
            status: "FAILURE",
            alertMsg: "Email doesn't exists!!",
        })
        return
    })

})

dbConnect()



app.listen(8080, () => {
    console.log("Listening to port 8080")
})