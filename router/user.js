const express =require("express");
const router =express.Router();
const User =require("../models/user.js");
const wrapAsync =require("../utils/wrapAsync.js");
const passport =require("passport");
const{saveRedirectUrl} = require("../middleware.js");
const userController =require("../controllers/users.js");

//SIGNUP ROUTE FOR GET REQUEST & SIGNUP ROUTE FOR POST REQUEST
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));






//LOGIN ROUTE FOR GET REQUEST &  LOGIN ROUTE FOR POST REQUEST
router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectUrl ,
    passport.authenticate("local",{failureRedirect :"/login",failureFlash:true}),userController.login
    );

//LOGOUT ROUTE FOR GET REQUEST
router.get("/logout", userController.logout);

module.exports = router;