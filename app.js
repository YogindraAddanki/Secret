//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require('mongoose-encryption');


const app = express();

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

//console.log(process.env.API_KEY);

userSchema.plugin(encrypt, {secret:process.env.secret, encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema);




app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",async(req,res) => {
    const newUser = new User({
        email : req.body.username,
        password: req.body.password
    });


   const result = await newUser.save();
   if(result){
       res.render("secrets");
   }
   else
   console.log(result);

});


app.post("/login",async(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;

    const foundName = await User.findOne({email: username})
    //console.log(foundName);
    if(foundName){
        if(foundName.password === password)
        res.render("secrets");
    }
    else{
        console.log("User not found");
    }
    
});


app.listen(3000,function(){
    console.log("Server started on port 3000");
})