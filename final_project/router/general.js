// contains the skeletal implementations for the routes which a general user can access

// Import required modules
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  // Send JSON response with formatted books data
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding book's details
  const isbn = req.params.isbn;
  res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  // Retrieve the author parameter from the request URL
  const author = req.params.author.trim().toLowerCase();

  const results = {};

  // Iterate through the ‘books’ array & check the author matches the one provided in the request parameter
  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author) {
      results[isbn] = books[isbn];
    }
  }

  // If no books found for the author, return 404
  if (Object.keys(results).length === 0) {
    return res.status(404).json({ message: "No books found for that author" });
  }

  // Send the results as the response
  res.send(results);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
