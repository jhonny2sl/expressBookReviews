// contains the skeletal implementations for the routes which a general user can access

// Import required modules
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }

  // Return error if username or password is missing
  return res.status(404).json({message: "Username &/ password are not provided"});
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
  // Retrieve the title parameter from the request URL
  const title = req.params.title.trim().toLowerCase();

  const results = {};

  // Iterate through the ‘books’ array & check the title matches the one provided in the request parameter
  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title) {
      results[isbn] = books[isbn];
    }
  }

  // If no books found for the title, return 404
  if (Object.keys(results).length === 0) {
    return res.status(404).json({ message: "No books found for that title" });
  }

  // Send the results as the response
  res.send(results);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  // Retrieve the isbn parameter from the request URL and send the corresponding review from the book's detail
  const isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.general = public_users;
