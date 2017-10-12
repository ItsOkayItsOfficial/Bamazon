/*
 * Author: Alex P
 * Project Name: bamazon
 * Version: 1
 * Date: 10.09.17
 * URL:  https://github.com/ItsOkayItsOfficial/bamazon
 */

"use strict"

// Variables - Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("cli-table");
var key = require("./key.js");

// Variables - Global
var input = process.argv;
var op = input[2];
var term = input[3];

// Variables - Login credentials
var connection = mysql.createConnection({
  // Host
  host: "localhost",
  // Port
  port: 3306,
  // Username
  user: "root",
  // Password
  password: key.password,
  // Database
  database: "bamazon"
});


// Database - Connect to bamazon
connection.connect(function (error) {
  if (error) throw error;
});


// Function - Display all products
let displayAll = function () {

  // Connect - bamazon database
  connection.query('SELECT * FROM products', function (error, response) {
    if (error) {
      console.log(error)
    };

    // Variable (New) - table
    var theDisplayTable = new table({
      head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
      colWidths: [10, 30, 18, 10, 14]
    });

    // ForLoop - Returns each row
    for (var i = 0; i < response.length; i++) {
      theDisplayTable.push(
        [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
      );
    }

    // Log - table in it
    console.log(theDisplayTable.toString());
    inquireForPurchase();
  });

};
// End - displayAll


// Function - For Purchase
let inquireForPurchase = function () {
  // Inquirer - Get ID and Quantity
  inquirer.prompt([{
      name: "ID",
      type: "input",
      message: "What is the item number for the vehicle you want to purchase?"
    }, {
      name: 'Quantity',
      type: 'input',
      message: "How many vehicles do you want to purchase?"
    },

  ]).then(function (answers) {
    // Capture values
    var quantityDesired = answers.Quantity;
    var IDDesired = answers.ID;
    purchaseFromDatabase(IDDesired, quantityDesired);
  });

};
// End - inquireForPurchase


// Function - From Database
let purchaseFromDatabase = function (ID, quantityNeeded) {
  // Quantity check
  connection.query('SELECT * FROM products WHERE item_id = ' + ID, function (error, response) {
    if (error) {
      console.log(error)
    };

    // If - in stock
    if (quantityNeeded <= response[0].stock_quantity) {
      var totalCost = response[0].price * quantityNeeded;

      console.log("We have what you need! I'll have your order right out!");
      console.log("Your total cost for " + quantityNeeded + " " + response[0].product_name + " is USD $" + totalCost + ". Thank you for your business!");

      connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantityNeeded + ' WHERE item_id = ' + ID);
    } else {
      console.log("Our apologies. We don't have enough " + response[0].product_name + " to fulfill your order.");
    };

    // Recursive party
    displayAll();
  });

};
// End - purchaseFromDatabase

// Run
displayAll();