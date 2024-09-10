const { verifySignUp, sitesVerification } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const express= require('express');
const db = require("../models");
const User = db.user;
const Role = db.role;
const Sites=db.sites;
const Website= db.website;
const siteverifier = db.emailverification;
const path = require('path');
var bcrypt = require("bcryptjs");
// app.use(express.json())
module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  }); 

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.delete("/api/auth/remove",controller.remove);
  app.post("/api/auth/signout", controller.signout);
  app.post("/api/auth/submit", sitesVerification.Checkduplicatesite, controller.submit);

  app.get("/api/users/:userId",controller.load);

app.get ("/user/verify/:userId/:uniqueString" ,(req,res)=>{
  console.log('got');
  let{userId, uniqueString} = req.params;
  siteverifier
  .find({userId})
  .then((result)=>{
    if (result.length>0){

      const {expiresOn} = result[0];
      const hashedUniqueString = result[0].uniqueString;
      // console.log(hashedUniqueString);
      console.log(uniqueString);
      if (expiresOn< Date.now()){
        siteverifier
        .deleteOne({userId})
        .then(result =>{
          User
          .deleteOne({_id:userId})
          .then(() => {
            let message = "Link has expired. Please sign up again";
            res.redirect(`/user/verified/error=true&message=${message}`)
          })
          .catch(error=>{
            let message = "Clearing user with expired unique string failed";
            res.redirect(`/user/verified/error=true&message=${message}`);
          })
        })
        .catch((error)=>{
          console.log(error);
          let message = "an error occurred while checking for existing user verification record";
          res.redirect(`/user/verified/error=true&message=${message}`)
        })
      }
      else{
        //valid record exists so we validate the user string
        //first steps to compare the hashed unique string 

        bcrypt.compare(uniqueString, hashedUniqueString)
        .then( result =>{
          if (result){
            console.log('yay');
            //strings match
            User
            .updateOne({_id: userId},{confirmed:true})
            .then(()=>{
              res.sendFile(path.join(__dirname,"./../views/verified.html"))
              console.log('noice')
            })
            .catch(error=>{
              console.log(error);
              let message = "error occurred while updating user record to show verified";
              res.redirect(`/user/verified/error=true&message=${message}`);
            })
                      }
          else{
            console.log('nay');
            let message = "invalid verification details passed , check your inbox fool";
            res.redirect(`/user/verified/error=true&message=${message}`);

          }
        })
        .catch(error => {
          let message = "error occurred while  checking for user verification record";
          res.redirect(`/user/verified/error=true&message=${message}`);
        }

        )
      }
    }else{
`  `  ;let message= "Account record doesnt exist or has been already verified. Please sign up or log in ";
      res.redirect(`/user/verified/error=true&message=${message}`)
    }
  }

  )
  .catch((error) => {
    console.log(error)
  })
} )
}


