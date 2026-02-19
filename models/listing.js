const mongoose= require("mongoose");
const Schema= mongoose.Schema;
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
  url: {
    type: String,
    default: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    set: (v) => v === "" ? "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b" : v,
  },
  filename: {
    type: String,
    default: "default",
  },
},

  /*image: {
    url: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
    },
    filename: {
      type: String,
      default: "default",
    },
  },*/

  price: Number,
  location: String,
  country: String,
  review:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner :{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
  },
});
/*const listingSchema= new Schema({
    title:{type:String,
           required:true,

    },
    description:String,

    image: {
     type: String,
     default: "https://unsplash.com/photos/the-sun-is-setting-over-the-mountains-in-the-distance-RsCvxI9h2Ew",
    set: v =>
     v === ""
      ? "https://unsplash.com/photos/the-sun-is-setting-over-the-mountains-in-the-distance-RsCvxI9h2Ew"
      : v,
},
   /* image: {
        type:String,
        url:String,
        filename:String,
        default: 
        "https://unsplash.com/photos/the-sun-is-setting-over-the-mountains-in-the-distance-RsCvxI9h2Ew",
        set: (v)=> v === "" ? "https://unsplash.com/photos/the-sun-is-setting-over-the-mountains-in-the-distance-RsCvxI9h2Ew":v,
     },
    price:Number,
    location:String,
    country:String,



});*/
const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;