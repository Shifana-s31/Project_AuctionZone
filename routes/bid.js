const express = require("express");

// auctionRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const bidRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// authentication middleware
const auth = require("./auth");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// multer is used to hadle files recieved from form

// This section will help you create a new auction.
bidRoutes.route("/bid/add").post(auth, async function (req, response) {
  let myobj = {
    amount: parseInt(req.body.amount),
    auctionId: req.body.auctionId,
    bidderId: req.body.userId,
    bidderName: req.body.userName,
  };
  let db_connect = dbo.getDb();

  // fetch minimum bid amount for the auction
  const query = { _id: ObjectId(myobj.auctionId) };
  const auction = await db_connect
    .collection("auctions")
    .findOne(query)
    .then((auction) => auction);
  const minimumBid = parseInt(auction.minimumBid);
  // validate request data
  if (myobj.amount < 0) {
    // amount must be greater than zero
    response.send({
      success: false,
      login: true,
      message: "Amount must be greater than ZERO!",
      _id: myobj._id,
    });
  } else {
    //    check whether bid already added by user
    const query = { bidderId: myobj.bidderId, auctionId: myobj.auctionId };
    const bidCheck = await db_connect
      .collection("bids")
      .findOne(query)
      .then((bidCheck) => bidCheck);

    if (bidCheck == null) {
      if (myobj.amount < minimumBid) {
        // amount must be greater than minimum bid
        response.send({
          success: false,
          login: true,
          message: "Amount must be greater than Minimum bid!",
          _id: myobj._id,
        });
      } else {
        db_connect.collection("bids").insertOne(myobj, function (err, res) {
          if (err) throw err;
          response.send({
            success: true,
            login: true,
            message: "Bid added successfully",
            _id: myobj._id,
          });
        });
      }
    } else {
      newAmount = bidCheck.amount + parseInt(req.body.amount);
      // console.log("cur : ", parseInt(req.body.amount));
      // console.log("prev : ", bidCheck.amount);
      // console.log("mew : ", newAmount);

      // check for maximum bid amount yet added
      let maxBid = 0;
      db_connect
        .collection("bids")
        .find({auctionId: myobj.auctionId})
        .sort({ amount: -1 })
        .limit(1)
        .toArray(function (err, result){
            if (err) throw err;
            maxBid = result[0].amount;
            
      // permit bid update only if the new resulting amount greater than current maximum bid amount
      if (newAmount > maxBid){
        let newvalue = {
          $set: {
            amount: newAmount,
          },
        };
        db_connect
          .collection("bids")
          .updateOne(query, newvalue, function (err, res) {
            if (err) throw err;
            response.send({
              success: true,
              login: true,
              message: "Bid updated successfully",
              _id: myobj._id,
            });
          });
      }else {
        const addMore = maxBid - bidCheck.amount;
        response.send({
          success: false,
          login: true,
          message: `Oops..! Please add atleast ${addMore + 1} for leader ship!`,
          _id: myobj._id,
        });
      }
            
        });

    }
  }
});

// bid list for particular auction with id
bidRoutes.route("/bids/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  db_connect
  .collection("bids")
  .find({auctionId: req.params.id})
  .sort({ amount: -1 })
  .limit(5)
  .toArray(function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// get list of all bids in ascending order of amount
bidRoutes.route("/bids").get(function (req, res) {
  let db_connect = dbo.getDb("auctionZone");
  db_connect
    .collection("bids")
    .find({})
    .sort({ amount: -1 })
    .limit(5)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = bidRoutes;
