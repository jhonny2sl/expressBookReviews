// contains the skeletal implementations for the routes which an authorized user can access

// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  // write code to check is the username is valid
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter(user => user.username === username);
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
  // write code to check if username and password match the one we have in records.
  // Filter the users array for any user with the same username and password
  let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
  }

  // Authenticate user
  if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign({
          data: password
      }, 'access', { expiresIn: 60 * 60 });
      // Store access token and username in session
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logged in");
  } else {
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  // Get the review from query parameters
  const review = req.query.review;
  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  // ensure session + username exist
  if (!req.session || !req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not logged in" });
  }
  let loggedUser = req.session.authorization['username'];

  const isbn = req.params.isbn;
  let book = books[isbn];  // Retrieve book object associated with isbn

  // Check if the book with the given ISBN exists
  if (book) {
    // ensure reviews object exists, then add/update review keyed by username
    book.reviews = book.reviews || {};
    const existed = Object.prototype.hasOwnProperty.call(book.reviews, loggedUser);
    book.reviews[loggedUser] = review;

    return res.status(200).json({
      message: existed ? "Review updated successfully" : "Review added successfully",
      reviews: book
    });
  } else {
    // Send a error response If the book with the given ISBN does not exist
    return res.status(404).json({ message: "Book not found" });
  }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  // ensure session + username exist
  if (!req.session || !req.session.authorization || !req.session.authorization.username) {
    return res.status(403).json({ message: "User not logged in" });
  }
  let loggedUser = req.session.authorization['username'];

  // Extract ISBN from request parameter
  const isbn = req.params.isbn;
  let book = books[isbn];  // Retrieve book object associated with isbn

  // Check if the book with the given ISBN exists
  if (book) {
    // Check if the logged-in user has a review for the book
    if (book.reviews && Object.prototype.hasOwnProperty.call(book.reviews, loggedUser)) {
      // Delete the review
      delete book.reviews[loggedUser];
      return res.status(200).json({ message: "Review deleted successfully", reviews: book });
    } else {
      return res.status(404).json({ message: "Review not found for the user" });
    }
  } else {
    // Send a error response If the book with the given ISBN does not exist
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
