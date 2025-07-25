const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// Curb Cores Error by adding a header here
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});
// make uploads folder public
app.use("/uploads", express.static("uploads"));
// routes
app.use(require("./routes/user"));
app.use(require("./routes/auction"));
app.use(require("./routes/bid"));

// get driver connection
const dbo = require("./db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// for time manipulation
moment = require("moment");
// app.get("/editProfile/:id",(req,res)=>{
//   console.log("hit");
// })
app.listen(port, () => {
  // perform a database connection when server starts
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });
  console.log(`Server is running on port: ${port}`);
});


// sleep function for checking fuction
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
// function checking for auction ended or not
(async function () {
  var tempEndDate;
  while (true) {
    // check forever
    let currentDate = moment();
    await sleep(2000);
    let db_connect = dbo.getDb("auctionZone");
    db_connect
      .collection("auctions")
      .find({})
      .toArray(function (err, result) {
        if (err) throw err;
        result.forEach(function (auction, index) {
          tempEndDate = moment(`${auction.endDate} ${auction.endTime}`);
          // check auction ended
          if (tempEndDate.isBefore(currentDate)) {
            let newvalues = {
              $set: {
                active: false,
              },
            };
            db_connect
              .collection("auctions")
              .updateOne(
                { _id: ObjectId(auction._id) },
                newvalues,
                function (err, res) {
                  if (err) throw err;
                  // code to run after auction ended
                  // find winner add notification for the winner
                  // get the winner
                  db_connect
                    .collection("bids")
                    .find({ auctionId: auction._id.toString() })
                    .sort({ amount: -1 })
                    .limit(1)
                    .toArray(function (err, result) {
                      if (err) throw err;
                      // check any bids added
                      if (result.length > 0 && auction.active) {
                        let winnerobj = {
                          userId: result[0].bidderId,
                          userName: result[0].bidderName,
                          auctionId: auction._id.toString(),
                          sellerId: auction.userId,
                          sellerName: auction.userName,
                        };
                        // add user info in DB
                        db_connect
                          .collection("winners")
                          .insertOne(winnerobj, function (err, res) {
                            if (err) throw err;
                          });
                          console.log("winner added", winnerobj);
                      }
                    });
                }
              );
          } else {
            // check any auctions started
            let newvalues = {
              $set: {
                active: true,
              },
            };
            db_connect
              .collection("auctions")
              .updateOne(
                { _id: ObjectId(auction._id) },
                newvalues,
                function (err, res) {
                  if (err) throw err;
                  // console.log("1 auction started");
                }
              );
          }
        });
      });
  }
})();
