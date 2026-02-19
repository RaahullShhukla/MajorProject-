const express = require("express");
const router =express.Router();

 //INDEX route for post
router.get("/",(req,res)=>{
    res.send(" Index route for post");
});
 //show route for post
 router.get("/:id",(req,res)=>{
    res.send("Show route for post");
 });
 //post route for post
 router.post("/",(req,res)=>{
    res.send("Post route for post");

 });
 //Delete route for post
 router.delete("/:id",(req,res)=>{
    res.send("Delete Route for post");
 });


 module.exports = router;