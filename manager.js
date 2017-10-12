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

        // Log - Table
        console.log(theDisplayTable.toString());
        inquireForUpdates();
    });

};
// End - displayAll


// Function - Look for updates
let inquireForUpdates = function () {
    // Inquirer - Choose action
    inquirer.prompt([{
        name: "action",
        type: "list",
        message: "Choose an option below:",
        choices: ["Restock Inventory", "Add New Product", "Remove an Existing Product"]

    }]).then(function (answers) {
        // Switch - Run function based on user input
        switch (answers.action) {

            case 'Restock Inventory':
                restockRequest();
                break;

            case 'Add New Product':
                addRequest();
                break;

            case 'Remove an Existing Product':
                removeRequest();
                break;
        }
    });
};
// End - inquireForUpdates


// Function - Restock request
let restockRequest = function () {
    // Inquirer - Get ID and Quantity
    inquirer.prompt([{
            name: "ID",
            type: "input",
            message: "What is the item number of the vehicle you wish to restock?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to order?"
        },

    ]).then(function (answers) {
        // Capture values
        var quantityAdded = answers.Quantity;
        var IDOfProduct = answers.ID;
        restockDatabase(IDOfProduct, quantityAdded);
    });
};
// End - restockRequest


// Function - Restock input into database
let restockDatabase = function (id, quant) {
    // Connect to database
    connection.query('SELECT * FROM products WHERE item_id = ' + id, function (error, response) {
        if (error) {
            console.log(error)
        };

        // Query to database
        connection.query('UPDATE products SET stock_quantity = stock_quantity + ' + quant + ' WHERE item_id = ' + id);

        // Run - displayAll with updated
        displayAll();
    });
};
// End - restockDatabase


// Function - Get new stock
let addRequest = function () {
    // Inquirer - Get ID and Quantity to restock
    inquirer.prompt([

        {
            name: "Name",
            type: "input",
            message: "What is the name of the vehicle you wish to stock?"
        },
        {
            name: 'Category',
            type: 'input',
            message: "What is the department for this vehicle?"
        },
        {
            name: 'Price',
            type: 'input',
            message: "How much does this cost?"
        },
        {
            name: 'Quantity',
            type: 'input',
            message: "How many would you like to add?"
        },

    ]).then(function (answers) {
        // Capture values
        var name = answers.Name;
        var category = answers.Category;
        var price = answers.Price;
        var quantity = answers.Quantity;

        // Run - buildNewItem
        buildNewItem(name, category, price, quantity);
    });
};
// End - addRequest


// Function - Add new stock to database
let buildNewItem = function (name, category, price, quantity) {
    // Query to database
    connection.query('INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES("' + name + '","' + category + '",' + price + ',' + quantity + ')');

    // Run - displayAll updated
    displayAll();

};
// End - buildNewItem


// Function - Remove stock
let removeRequest = function () {
    // Inquirer - Get ID
    inquirer.prompt([
        {
        name: "ID",
        type: "input",
        message: "What is the item number of the vehicle you wish to remove?"

    }]).then(function (answer) {
        var id = answer.ID;

        // Run - removeFromDatabase
        removeFromDatabase(id);
    });
};
// End - removeRequest


// Function - Remove stock from database
let removeFromDatabase = function (id) {
    // Query to database
    connection.query('DELETE FROM products WHERE item_id = ' + id);

    // Run - displayAll updated
    displayAll();
};
// End - removeFromDatabase


// Run - displayAll
displayAll();