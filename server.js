


const db = require("./app/models");
const User = db.user;
const Sites=db.sites;
const Website= db.website;
const express = require("express");
const crypto = require('crypto');
const cors = require("cors");
const cookieSession = require("cookie-session");
const yhh= require('dotenv').config();
const dbConfig = require("./app/config/db.config");

const WebSocket = require('ws');
const http = require('http');


const app = express();

const username= process.env.username;
const password=process.env.password;

console.log(password);


app.use(cors());
/* for Angular Client (withCredentials) */
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:4000"],
  })
);

// parse requests of content-type - application/json
app.use(express.json());

const path = __dirname + '/app/views/';
app.use(express.static(path));
app.get('/', function (req,res) {
  res.sendFile(path + "index.html");
});
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(
  cookieSession({
    name: "bezkoder-session",
    keys: ["COOKIE_SECRET"], // should use as secret environment variable
    httpOnly: true
  })
);

const Role = db.role;

db.mongoose
  .connect(`mongodb+srv://sachin10_12:${password}@cluster0.0apr8pn.mongodb.net/?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch(err => {
    console.error("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Clocky." });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
const httpserver = http.createServer(app);
// set port, listen for requests
const PORT_http = process.env.PORT_http || 8080;
// const PORT_WS = process.env.PORT_WS || 3000;

const wss = new WebSocket.Server({server:httpserver});

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log('Received:', message);
    // Echo the message back to the client
    let messageStr =  JSON.parse(message);
    console.log(messageStr);
        // Parse the string as JSON
    let parsedMessage;
    if (messageStr.action === "username delivered"){
      try {
        // parsedMessage = JSON.parse(messageStr);
        console.log('Received:', messageStr);
      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
      ws.send(`Server received: ${message}`);
      console.log(messageStr);
      let username = messageStr.username;
      username = username.replace(/^'|'$/g, '');
      const user1=  User.findOne({username:username}).
      exec(
        (err,user)=>{
          if (err) {
            // res.status(500).send({ message: err });
            return;
          }
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          user.populate('websites',(err,populatedsites)=>{
            if (err) {
              res.status(500).send({ message: err });
              return;
          }
          else{
            console.log(populatedsites.websites);
            let arr_1 = populatedsites.websites;
            checkAndResetDaily(user.temp_websites);
            for (let i = arr_1.length -1 ;i>=0 ; i -- ){
            if (arr_1[i] in user.temp_websites){
              arr_1.splice(i,1);
              }
            }
            const jsonwebsites = JSON.stringify({
              message:"here are the user websites",
              sites: arr_1,
              visitedsites:user.temp_websites});
            
            ws.send(jsonwebsites);
          }
          })
          
  
        }
      )
    }
    if (messageStr.message === "paused timer from old tab"){
      try {
        // parsedMessage = JSON.parse(messageStr);
        // console.log('Received:', messageStr);

      } catch (e) {
        console.error('Error parsing JSON:', e);
      }
      ws.send(`Server received: ${message}`);
      let username = messageStr.username;
      username = username.replace(/^'|'$/g, '');
      const user1=  User.findOne({username:username}).
      exec(
        (err,user)=>{
          if (err) {
            // res.status(500).send({ message: err });
            return;
          }
          if (!user) {
            return res.status(404).send({ message: "User Not found." });
          }
          let key = messageStr.url;
          console.log(key);
          // const hashedKey = crypto.createHash('sha256').update(key).digest('hex');
          let timer_1 = messageStr.timers;
          if (Object.keys(user.temp_websites).length === 0) {
            // temp_websites is an empty object
            user.temp_websites = {};
          }
          // delete user.temp_websites.l;
          user.temp_websites[key] = timer_1;
          user.save(err => {
            if (err) {
              console.log("error", err);
            }
    
            console.log("added pausedtimer");
            
          })
          
          console.log(user);
  
        }
      )
      
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });

  ws.send('Welcome to the WebSocket server!');
});


httpserver.listen(PORT_http, () => {
  console.log(`Server is running on port ${PORT_http}.`);
});


// module.exports.wss = wss;


const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

let lastResetDate = null;

function resetWebSocketConnections() {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.terminate();  // Forcefully close the connection
        }
    });

    console.log('WebSocket connections have been reset.');
}

function checkAndResetDaily(data) {
    const now = new Date();
    const currentDate = now.toDateString(); // Get current date as a string

    if (lastResetDate !== currentDate) {
        resetWebSocketConnections();
        data = {};
        lastResetDate = currentDate;

    }
}

// Call this function when the server starts
// checkAndResetDaily();

// Optional: Schedule a check every hour (or any interval you like)
setInterval(checkAndResetDaily, 60 * 60 * 1000); // 1 hour in milliseconds

// WebSocket connection handling logic

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin"
      }).save(err => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
}

// WebSocket server setup
