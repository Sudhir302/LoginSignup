const express = require('express')
const app = express()
const path = require("path")
const collection = require("./mongodb")


app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.set("view engine", "ejs")

app.get('/login', (req,res)=>{
    res.render("login.ejs")
})

app.get('/',(req,res)=>{
    res.render("home.ejs")
})
 

app.get("/signup",(req,res)=>{
    res.render("signup")
})


// -----------------for signup-------------------------

app.post("/signup",async(req,res)=>{

    if(req.body.password.length < 7){
        res.send("The password most be above 7 character go to signup page again")
        return
    }

    const userAlreadyExists = await collection.findOne({name: req.body.name})

    if(userAlreadyExists){
        res.send("User exist")
    }

    else{
        const data = {
            name : req.body.name,
            password : req.body.password
        }
        await collection.insertMany([data])
        res.render("dash")
    }
})

// -----------------------for login----------------------------

app.post("/login",async(req,res)=>{

    try{
        const check = await collection.findOne({name:req.body.name})
        if(check.password === req.body.password){
            res.render("dash")
        }
        else{
            res.send("Invalid Password")
        }
    }
    catch{
        res.send("wrong details")
    }
})


app.listen(3000,()=>{
    console.log("I am listening")
})