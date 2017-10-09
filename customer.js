/*
* Author: Alex P
* Project Name: bamazon
* Version: 1
* Date: 10.09.17
* URL:  https://github.com/ItsOkayItsOfficial/bamazon
*/

// Variables - Modules
var mysql = require("mysql");
var inquirer = require("inquirer");
var key = require("./keys.js")

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


// Connect to greatbay_db
connection.connect(function (error) {
  if (error) throw error;

  // Run - start
  start();
});

// Function - Initiate auction from user
let start = function () {
    inquirer
      .prompt({
        name: "postOrBid",
        type: "rawlist",
        message: "Would you like to [POST] an auction or [BID] on an auction or [SEARCH] for an item/seller?",
        choices: ["POST", "BID", "SEARCH"]
      })
      .then(function (answer) {
          // If - Answer from prompt
          if (answer.postOrBid.toUpperCase() === "POST") {
            postAuction();
          } else if (answer.postOrBid.toUpperCase() === "BID" {
              bidAuction();
            } else if (answer.postOrBid.toUpperCase() === "SEARCH" {
                inquirer
                  .prompt([{
                      name: "type",
                      message: "How would you like to search for an auction?",
                      type: "rawlist",
                      choices: ["ITEM", "CATEGORY"]
                    },
                    {
                      name: "term",
                      message: "What exactly are you looking for?",
                      type: "input"
                    }
                  ])
                  .then(functinon(answer) {
                      querySearch(
                        answer.type; answer.term;)
                    };
                  })
            }

            // Function - Search database
            let querySearch = function (type, term) {
              var query = connection.query("SELECT * FROM auctions WHERE", [type], "=?", [term], function (error, response) {
                for (var i = 0; i < response.length; i++) {
                  console.log(response[i].id + " | " + response[i].item_name + " | " + response[i].category + " | " + response[i].starting_bid + " | " + response[i].highest_bid);
                }
              });
              // logs the actual query being run
              console.log(query.sql);
            }


            // Function - User can place item up for bid
            let postAuction = function () {
              // Inquirer - Input for the bid
              inquirer
                .prompt([{
                    name: "item",
                    type: "input",
                    message: "Please input what item you'd like to place for auction."
                  },
                  {
                    name: "category",
                    type: "input",
                    message: "What category would you like to place your item to auction?"
                  },
                  {
                    name: "startingBid",
                    type: "input",
                    message: "What would you like the bidding to start at?",
                    validate: function (value) {
                      if (isNaN(value) === false) {
                        return true;
                      }
                      return false;
                    }
                  }
                ])
                .then(function (answer) {
                  // when finished prompting, insert a new item into the db with that info
                  connection.query(
                    "INSERT INTO auctions SET ?", {
                      item_name: answer.item,
                      category: answer.category,
                      starting_bid: answer.startingBid,
                      highest_bid: answer.startingBid
                    },
                    function (error) {
                      if (error) throw error;
                      console.log("Your auction was created successfully!");

                      start();
                    }
                  );
                });
            }

            let bidAuction = function () {

              connection.query("SELECT * FROM auctions", function (error, responseults) {
                if (error) throw error;
                // once you have the items, prompt the user for which they'd like to bid on
                inquirer
                  .prompt([{
                      name: "choice",
                      type: "rawlist",
                      choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < responseults.length; i++) {
                          choiceArray.push(responseults[i].item_name);
                        }
                        return choiceArray;
                      },
                      message: "What auction would you like to place a bid in?"
                    },
                    {
                      name: "bid",
                      type: "input",
                      message: "How much would you like to bid?"
                    }
                  ])
                  .then(function (answer) {
                    // get the information of the chosen item
                    var chosenItem;
                    for (var i = 0; i < responseults.length; i++) {
                      if (responseults[i].item_name === answer.choice) {
                        chosenItem = responseults[i];
                      }
                    }

                    // determine if bid was high enough
                    if (chosenItem.highest_bid < parseInt(answer.bid)) {
                      // bid was high enough, so update db, let the user know, and start over
                      connection.query(
                        "UPDATE auctions SET ? WHERE ?", [{
                            highest_bid: answer.bid
                          },
                          {
                            id: chosenItem.id
                          }
                        ],
                        function (error) {
                          if (error) throw error;
                          console.log("Bid placed successfully!");
                          start();
                        }
                      );
                    } else {
                      // bid wasn't high enough, so apologize and start over
                      console.log("Your bid was too low. Try again...");
                      start();
                    }
                  });
              });
            }