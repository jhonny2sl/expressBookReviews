// main server application file

// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

// Create the Express app instance
const app = express();

// Parse any incoming request bodies as JSON
app.use(express.json());

// Set up session management and a signed session ID cookie for customer routes
/* 
secret: "fingerprint_customer" — used to sign the session ID cookie. In production use a strong secret from env vars.
resave: true — forces the session store to save the session on every request even if it wasn't modified (usually unnecessary and not recommended).
saveUninitialized: true — creates and saves a session for new requests even if the session has no data (can lead to lots of empty sessions; often set to false). 
*/
app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

// Middleware to authenticate requests to "/customer/auth/*" endpoint
app.use("/customer/auth/*", function auth(req, res, next){
    // Check if user is logged in and has valid access token
    if (req.session.authorization){
        let token = req.session.authorization['accessToken'];

        // Verify JWT token
        jwt.verify(token, "access", (err, user) => {
          if(!err){
            req.user = user;
            next();
          } else {
            return res.status(403).json({message: "User not authorized"});
          }
        });

    } else {
      return res.status(403).json({message: "User not logged in"});
    }
});

// Set the port number for the server to listen on
const PORT =5000;

// Mount the customer and general routers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

// Start the server and listen on the specified port
app.listen(PORT,()=>console.log("Server is running"));
