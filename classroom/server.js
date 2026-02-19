const express = require("express");
const app = express();
const users = require("./router/user.js");
const posts = require("./router/post.js");
const session = require("express-session");
const flash =  require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname,"views"));




const sessionOption = { secret:"mysecretsuperstring",
                        resave: false,
                        saveUninitialized:true,

};

app.use(session(sessionOption));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.successMsg =req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
});

app.get("/register", (req,res)=>{
    let{ name = "anonymous"} =req.query;
    req.session.name = name;
    console.log(name);
    if(name ==="anonymous"){
        req.flash("error","sorry you are not a user please try again");
    }else{
        req.flash("success", "congratulation brother you are most welcme at this page");
    }
    //res.send(name);
   // req.flash("success","congratulation you are new user here!");
    res.redirect("/hello");
    console.log(req.session);


});
app.get("/hello",(req,res)=>{
    //res.send(`hello, ${req.session.name}`);
    res.render("page.ejs",{name:req.session.name});
});
app.get("/reqcount",(req,res)=>{
    if(req.session.count){
        req.session.count++;
    }
    else{
        req.session.count =1;
    }
    res.send(`you sent a request ${req.session.count} times`);
});


app.get("/test",(req,res)=>{
    res.send(" test successful");
});

 
//Basic Route
app.get("/",(req,res)=>{
    res.send("Hi, I am basic root!");
});

app.use("/users", users);
app.use("/posts", posts);


 //connection port route

 app.listen(3000,()=>{
    console.log("server is listening at the port 3000");
 });
 