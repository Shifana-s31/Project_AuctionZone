const express = require("express");

// auctionRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const auctionRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// authentication middleware
const auth = require("./auth");

// for date and time manipulation
const moment = require("moment");

// multer is used to hadle files recieved from form
const multer = require("multer");

// uuid is used to generate unique id
const { v4: uuidv4 } = require("uuid");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      uuidv4() + "-" + Date.now() + "-" + path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });
// This section will help you register a new auction.
auctionRoutes
  .route("/auction/add")
  .post(upload.array("images", 12), auth, async function (req, response) {
    let db_connect = dbo.getDb();
    let filenames = [];
    let noNull = true;
    let nullProperty = "";
    req.files.forEach(function (fileObj) {
      var fname = fileObj.filename;
      filenames.push(fname);
    });
    let myobj = {
      name: req.body.name,
      description: req.body.description,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      minimumBid: req.body.minimumBid,
      images: filenames,
      userId: req.body.userId,
    };
    // console.log(myobj.userId, "userid");
    // check for null values
    for (const property in myobj) {
      if (myobj[property] == "") {
        noNull = false;
        nullProperty = property;
        break;
      }
    }
    // insert data only if no nullvalues
    if (noNull) {
      // find user who adding auction and append firstname to myobj
      db_connect
        .collection("users")
        .findOne({ _id: ObjectId(myobj.userId) }, function (err, result) {
          if (err) throw err;
          myobj.userName = result.firstName;

          // validate dates
          const currentDate = moment();
          const InputStartDate = moment(
            `${myobj.startDate} ${myobj.startTime}`
          );
          const InputEndDate = moment(`${myobj.endDate} ${myobj.endTime}`);

          if (InputStartDate.isBefore(currentDate)) {
            response.send({
              registered: false,
              login: true,
              message: `Start date and start time can not be in past..!`,
              _id: myobj._id,
            });
          } else if (InputEndDate.isBefore(InputStartDate)) {
            response.send({
              registered: false,
              login: true,
              message: `End date and end time must before start date and start time..!`,
              _id: myobj._id,
            });
          } else {
            // insert data to DB
            db_connect
              .collection("auctions")
              .insertOne(myobj, function (err, res) {
                if (err) throw err;
                response.send({
                  registered: true,
                  login: true,
                  message: "Auction registred successfully",
                  _id: myobj._id,
                });
              });
          }
        });
    } else {
      response.send({
        registered: false,
        login: true,
        message: `${nullProperty} can not be empty`,
        _id: myobj._id,
      });
    }
  });

// get list of all auctions
auctionRoutes.route("/auctions").get(function (req, res) {
  let db_connect = dbo.getDb("auctionZone");
  db_connect
    .collection("auctions")
    .find({})
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// search auctions
auctionRoutes.route("/auction/search").post(function (req, res) {
  let db_connect = dbo.getDb();
  console.log("req body : ", req.body);
  let searchKeyword = req.body.searchKeyword;
  // console.log("srch key : ", searchKeyword);
  let myquery = {
    $or: [
      { name: { $regex: new RegExp(searchKeyword, "i") } },
      { description: { $regex: new RegExp(searchKeyword, "i") } },
    ],
  };
  db_connect
    .collection("auctions")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// get single auction by id
auctionRoutes.route("/auction/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("auctions").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});
// get auction list of a user
auctionRoutes.route("/auctions/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { userId: req.params.id };
  db_connect
    .collection("auctions")
    .find(myquery)
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

module.exports = auctionRoutes;
