// REQUIRES
const express= require("express");
const app=express();
const mongoose= require("mongoose");
const path=require("path");
const methodOverride= require("method-override");
const ExpressError =require("./utils/ExpressError.js");
const ejsMate = require("ejs-mate");
const session =require("express-session");
const flash =require("connect-flash");
const passport =require("passport");
const LocalStrategy =require("passport-local");
const User = require("./models/user.js");


//FOR ROUTER ROUTE FILE REQUIRING
const listingRouter =require("./router/listing.js");
const reviewRouter =require("./router/review.js");
const userRouter =require("./router/user.js");


//Methods
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//CONNECTING TO OUR MONGO DATA-BASE
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{console.log("connected to DB");})
.catch((err)=>{console.log(err);});

async function main(){
    await mongoose.connect(MONGO_URL);
}


//ADDING MY SESSION OPTIONS
const sessionOptions ={
    secret:"mysecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true,
    },
};

//ADDING MY HOME ROUTE
app.get("/",(req,res)=>{
    res.send("HI, I am Root");
});


//FOR SESSION,FLASH AND PASSPORT MIDDLEWARE
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//FOR DEMO USER 
/*app.get("/demouser",async(req,res)=>{
    let fakeUser =new User({
        email:"student@gmail.com",
        username:"delta-student1",
    });

    let registeredUser =await User.register(fakeUser,"helloworld");
    res.send(registeredUser);
});*/

// FOR FLASH ,MIDDLEWARE
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser =req.user;
    next();
});




// FOR ROUTER 
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/" , userRouter);






//app.get("/testListing", async (req,res)=>{
 //   let sampleListing = new Listing({
  //      title:"My new Villa",
  //      description:"Way of beach",
   //     price:1200,
   //     location:"goa",
   //     country:"INDIA",
  //  });
   //  await sampleListing.save();
   // console.log("sample was saved");
    //res.send("successful testing");


//});
//ERROR HANDLER to handle the create route error

app.use((err, req, res, next) => {
  console.error("ERROR STACK ");
  console.error(err.stack);   

  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error", { message });
});

app.listen(8080,
    ()=>{console.log("server is listening to port 8080");});