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
var Table = require("cli-table");
var key = require("./keys.js");

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

  // Run - start
  start();
});


// Function - Display all products
let displayAll = function() {
    // Connect - bamazon database
    connection.query('SELECT * FROM products', function(error, response) {
        if (error) { console.log(error) };

        // Variable (New) - Table
        var theDisplayTable = new Table({
            head: ['Item ID', 'Product Name', 'Department', 'Price', 'Quantity'],
            colWidths: [10, 30, 18, 10, 14]
        });

        // ForLoop - Returns each row
        for (i = 0; i < response.length; i++) {
            //push data to table
            theDisplayTable.push(
                [response[i].ItemID, response[i].ProductName, response[i].DepartmentName, response[i].Price, response[i].StockQuantity]
            );
        }

        // Log - Table in it
        console.log(theDisplayTable.toString());
        inquireForPurchase();
    });

};
// End - displayAll


// Function - For Purchase
let inquireForPurchase = function() {
    //get item ID and desired quantity from user. Pass to purchase from Database
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the item number of the item you wish to purchase?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to buy?"
        },

    ]).then(function(answers) {
        //set captured input as variables, pass variables as parameters.
        var quantityDesired = answers.Quantity;
        var IDDesired = answers.ID;
        purchaseFromDatabase(IDDesired, quantityDesired);
    });

};
// End - inquireForPurchase


function purchaseFromDatabase(ID, quantityNeeded) {
    //check quantity of desired purchase. Minus quantity of the itemID from database if possible. Else inform user "Quantity desired not in stock"
    connection.query('SELECT * FROM Products WHERE ItemID = ' + ID, function(error, response) {
        if (error) { console.log(error) };

        //if in stock
        if (quantityNeeded <= response[0].StockQuantity) {
            //calculate cost
            var totalCost = response[0].Price * quantityNeeded;
            //inform user
            console.log("We have what you need! I'll have your order right out!");
            console.log("Your total cost for " + quantityNeeded + " " + response[0].ProductName + " is " + totalCost + ". Thank you for your Business!");
            //update database, minus purchased quantity
            connection.query('UPDATE Products SET StockQuantity = StockQuantity - ' + quantityNeeded + ' WHERE ItemID = ' + ID);
        } else {
            console.log("Our apologies. We don't have enough " + response[0].ProductName + " to fulfill your order.");
        };
        displayAll();//recursive shopping is best shopping! Shop till you drop!
    });

}; //end purchaseFromDatabase

displayAll();