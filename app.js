// REQUIRES
const express= require("express");
const app=express();
const mongoose= require("mongoose");
const Listing=require("./models/listing.js");
const Review = require("./models/review.js");
const path=require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync= require("./util/wrapAsync.js");
const ExpressError = require("./util/ExpressError.js");
const{listingSchema,reviewSchema} =require("./schema.js");
//const { MessagePort } = require("worker_threads");//

//Methods
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
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

app.get("/",(req,res)=>{
    res.send("HI, I am Root");
})


// Validate listing code//
const validateListing =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    } else{
        next();
    }
};
// Validate Review code//
const validateReview =(req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
       const errMsg = error.details.map(el=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    next()

   /* } else{ next();

    }*/
};


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
//INDEX ROUTE
app.get("/listings", wrapAsync(async(req,res)=>{
   const allListings=await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
}));

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("./listings/new.ejs");
});

//EDIT ROUTE
app.get("/listings/:id/edit", wrapAsync(async(req,res)=>{
    let{id} = req.params;
     const listing =await Listing.findById(id);
     res.render("listings/edit.ejs",{listing});
}));

//UPDATE ROUTE
app.put("/listings/:id", validateListing, wrapAsync(async(req,res)=>{
    // if(!req.body.listing){
      //  throw new ExpressError(400,"this is wrong one dear!");
   // }
    let{id} = req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      res.redirect(`/listings/${id}`);
}));


//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let{id} = req.params;
    const listing= await Listing.findById(id).populate("review");
    res.render("./listings/show.ejs",{listing});
}));

//CREATE ROUTE
app.post("/listings",validateListing, wrapAsync(async(req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");}
   
  
));
//app.post("/listings", wrapAsync(async (req, res) => {

   // if (!req.body.listing) {
     //   throw new ExpressError(400, "Listing data missing!");
  //  }

  //  const newListing = new Listing(req.body.listing);
    //await newListing.save();

   // res.redirect("/listings");
//}));




//DELETE ROUTE

app.delete("/listings/:id",wrapAsync(async(req,res)=>{
    let{id}= req.params;
    let deleteListing= await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listings");
}));
//Review ka Post Route//
/*app.post("/listings/:id/reviews",wrapAsync(async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("new review added");
    res.redirect(`/listings/${listing._id}`);
}));*/
/*app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const reviewData = req.body.review || {};

  const newReview = new Review(reviewData);

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));*/
/*app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  const reviewData = req.body.review || {};
  const newReview = new Review(reviewData);

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));*/
app.post("/listings/:id/reviews", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ExpressError(404, "Listing not found");
  }

  const reviewData = req.body.review {};
  const newReview = new Review({
    rating:reviewData.rating O,
    comment:reviewData.comment||""
  });

  listing.review.push(newReview);

  await newReview.save();
  await listing.save();

  res.redirect(`/listings/${listing._id}`);
}));

app.use((req,res,next)=>{
    next(new ExpressError(404,"page not found!"));
});

//ERROR HANDLER to handle the create route error
/*app.use((err,req,res,next)=>{*/
   
   /* let{statusCode =500,message= "something went wrong!"} = err;*/
   /* res.status(statusCode).render("listings/error.ejs",{message});*/
   /* res.status(statusCode).send(message);*/ 

    
/*app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error", { message });
});*/
app.use((err, req, res, next) => {
  console.error("ERROR STACK ");
  console.error(err.stack);   

  const { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("listings/error", { message });
});

app.listen(8080,
    ()=>{console.log("server is listening to port 8080");});