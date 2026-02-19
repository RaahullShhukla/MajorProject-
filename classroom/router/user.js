const express = require("express");
const router = express.Router();


//INDEX route for users
router.get("/",(req,res)=>{
    res.send(" Index route for users");
});
 //show route for users
 router.get("/:id",(req,res)=>{
    res.send("Show route for users");
 });
 //post route for users
 router.post("/",(req,res)=>{
    res.send("Post route for users");

 });
 //Delete route for users
 router.delete("/:id",(req,res)=>{
    res.send("Delete Route for users");
 });


 module.exports = router;