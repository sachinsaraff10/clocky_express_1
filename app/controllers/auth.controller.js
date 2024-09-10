const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;
const Sites=db.sites;
const Website= db.website;
const siteverifier = db.emailverification;
const Neverbounce = require('neverbounce');
// const {wss} = require('c:/Users/p_sar/node-js-express-login-mongodb/server.js');

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const nodemailer = require("nodemailer");
const {v4: uuidv4} = require("uuid");
const { Router, application } = require("express");
require("dotenv").config({path:'C:\Users\p_sar\node-js-express-login-mongodb\.env'});


const client = new Neverbounce({apiKey:process.env.API_key});
// nodemailer stuff
let transporter = nodemailer.createTransport({
  service:"gmail",
  auth:{
    user: process.env.AUTH_EMAIL,
    pass:process.env.AUTH_PASSWORD
  }
})

// const broadcast = (data) => {
//   wss.clients.forEach((client) => {
//     if (client.readyState === WebSocket.OPEN) {
//       client.send(JSON.stringify(data));
//     }
//   });
// };



exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    confirmed:false
  });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save((err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }

            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "user" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        user.roles = [role._id];
        user.save((err) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          res.send({ message: "User was registered successfully!" });
        });
      });
    }
  });

  transporter.verify((error,success)=>{
    if(error){
      console.log(error);
      // console.log(transporter.auth.user);
    }else{
      console.log("Ready for messages");
      console.log(success);
    }
  })
  
  const id = user._id;
  const email = user.email;
  console.log(id);
  // const uniquestring = uuidv4() + id;
  // verification email
  
  const sendverificationmail = ({id, email}, res) => {
    
    const currenturl = "http://localhost:8080";
    const uniquestring = uuidv4() + id;
   console.log(uniquestring);
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "verify your email",
      html: `<p>Verify your email id to complete the signup and login into your account. This link  <b>expires in 6 hours</b>. Press <a href= ${currenturl}/user/verify/${id}/${uniquestring} </a> to proceed
      `
  }
  const saltRounds = 10;
  
  bcrypt.hash(uniquestring,saltRounds)
  .then((hashedUniqueString)=>{
    const newverification = new siteverifier(
      {
        userId: id,
        uniqueString: hashedUniqueString,
        createdOn: Date.now(),
        expiresOn: Date.now() + 21600000,

  
      }
    )
    console.log(newverification);
    newverification.save()
  .then(()=>{
    transporter.sendMail(mailOptions)
    .then(()=>{
      console.log('success!')
      // email sent and verification record saved
      // res.json(
      //   {
      //     status: "pending",
      //     message : "verification mail sent"
      //   }
      // )
    })
    .catch((error)=>{
      console.log('whoops')
      // res.status(500).json({
      //   status: "failed",
      //   message: "Error occurred while hashing data",
      //   error: error.message // Include the error message from the caught error object
      // });
    })
  })
  .catch((error)=>{
    console.log(error)
    res.json(
      {
        status: "Failed",
        message:"An Error occured while hashing data"
      }
    )
  }) 
  })
  
  
  
  }
  
 sendverificationmail({id, email},res) 
  
};

exports.load = async(req,res)=>{
  // console.log(req);
  console.log(req.body);
  const user = await User.findById(req.params.userId).exec();
    if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

    console.log(user.websites);
    try{ 
      const sitelist = [];
      for (const websiteId of user.websites) {
        const website = await Website.findById(websiteId).exec();
        // res.status(200).send({
        //   URL:website.URL,
        //   hours:website.hours,
        //   minutes:website.minutes,
        //   seconds:website.seconds
        // })
        if (website) {
          sitelist.push({
              URL: website.website,
              hours: website.hours,
              minutes: website.minutes,
              seconds: website.seconds
          });
      }
    }
      res.status(200).send(sitelist);
  } 
      catch{
        console.error("Error fetching website data:");
    // res.status(500).send({ error: "Internal Server Error" });
      }
      
  
}

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      req.session.username= user.username;

      e_mail = user.email;
      _id_ = user._id;
      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        User.deleteMany({}, (err) => {
          if (err) {
            console.error('Error deleting user profiles:', err);
          } else {
            console.log('All user profiles deleted successfully');
          }
        })
        return res.status(401).send({ message: "Invalid Password!" });
      }

      if (!user.confirmed){
      linksender({_id_,e_mail},res);
      
        // User.deleteMany({}, (err) => {
        //   if (err) {
        //     console.error('Error deleting user profiles:', err);
        //   } else {
        //     console.log('All user profiles deleted successfully');
        //   }
        // });
        return res.status(403).send({message: "Email not confirmed yet please check your inbox and try in again"})
      

      }
      const token = jwt.sign({ id: user._id,
        username: user.username,
        email: user.email}    ,
                              config.secret,
                              {
                                algorithm: 'HS256',
                                allowInsecureKeySizes: true,
                                expiresIn: 86400, // 24 hours
                              });

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        token: token, 
      });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.remove = async (req,res)=>{
  console.log(req.body);
  const deleted = req.body.URL;
  const username_1 = req.session.username;
  const user = await User.findOne({username:username_1}).
  exec() 
  
    if (!user){
      res.status(500).send({ message: "User not found" });
      return;
      
    }
else{
for (const webID of user.websites){
  const site = await Website.findById(webID).
  exec();
  
    if (!site){
      return res.status(404).send({ message: "site not found" });
    }
    else{
      if (deleted === site.website){
        const updatedUser = await User.findByIdAndUpdate(
          user._id,
          { $pull: { websites: webID } },
          { new: true }
      );

      // If the user document was successfully updated
      if (updatedUser) {
          console.log(`Website with ID ${webID} removed from user's websites array.`);
      } else {
          console.log('User not found.');
      }
      }
    }
  
}  
}
  
}

exports.submit=async (req,res)=>{
console.log(req.body.timer);
console.log(req.session);
const user = req.session.username;
  const website =  new Website(
    {
      website: req.body.timer.URL,
      hours:parseInt(req.body.timer.hours, 10),
      minutes:parseInt(req.body.timer.minutes,10),
      seconds:parseInt(req.body.timer.seconds,10),
      
    });
    website.save((err,website)=>{
      if (err){
        res.status(500).send({ message: err });
        return; 
      };

      
    User.findOne({username:req.session.username})
    
    .exec((err,user)=>{
      if (err){
      res.status(500).send({ message: err });
      return;
      }
      else{
          user.websites.push(website);
          
          user.populate('websites', (err, populatedUser) => {
            if (err) {
                res.status(500).send({ message: err });
                return;
            }
            
            else{
              const profileUpdate = { type: 'profileUpdate', 
              websites: populatedUser.websites };
              // broadcast(profileUpdate);
                user.save((err,user)=>{
                if (err) {
                  res.status(500).send({ message: err });
                  return;
              }
              console.log(user);``
              website.owner.push(user);
              website.populate('owner',(err,website)=>{
                if (err){
                  res.status(500).send({ message: err });
                  return;
                }
                else{
                  website.save((err)=>{
                    if (err) {
                      res.status(500).send({ message: err });
                      return;
                  }
                  })
                }
                // console.log(populatedsite);
              })
              })
              
              
              
            }
            
            // console.log(populatedUser);
            // res.send({ message: "User was registered successfully!", user: populatedUser });
        });
          
      }
    })
    })
    
}

async function removeWebsiteFromUser(userId, websiteId) {
  try {
      // Update the user document to remove the website ID from the 'websites' array
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { $pull: { websites: websiteId } },
          { new: true }
      );

      // If the user document was successfully updated
      if (updatedUser) {
          console.log(`Website with ID ${websiteId} removed from user's websites array.`);
      } else {
          console.log('User not found.');
      }
  } catch (error) {
      console.error('Error:', error);
  }
}


const linksender = ({id, email}, res) => {
   console.log('sent'); 
  const currenturl = "http://localhost:8080";
  const uniquestring = uuidv4() + id;
 console.log(uniquestring);
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "verify your email",
    html: `<p>Verify your email id to complete the signup and login into your account. This link  <b>expires in 6 hours</b>. Press <a href= ${currenturl}/user/verify/${id}/${uniquestring} </a> to proceed
    `
}
const saltRounds = 10;

bcrypt.hash(uniquestring,saltRounds)
.then((hashedUniqueString)=>{
  const newverification = new siteverifier(
    {
      userId: id,
      uniqueString: hashedUniqueString,
      createdOn: Date.now(),
      expiresOn: Date.now() + 21600000,


    }
  )
  console.log(newverification);
  newverification.save()
.then(()=>{
  transporter.sendMail(mailOptions)
  .then(()=>{
    console.log('uhuh')
    // email sent and verification record saved

    // res.json(
    //   {
    //     status: "pending",
    //     message : "verification mail sent"
    //   }
    // )
  })
  .catch((error)=>{
    console.log('oops')
    // res.json(
    //   {
    //     status: "failed",
    //     message : "error occurred while hashing data"

    //   }
    // )
  })
})
.catch((error)=>{
  console.log(error)
  res.json(
    {
      status: "Failed",
      message:"An Error occured while hashing data"
    }
  )
}) 
})



}