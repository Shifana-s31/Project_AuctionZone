const express = require("express");

// userRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /user.
const userRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// bcrypt is used to encrypt the password
const bcrypt = require("bcrypt");

// json web token
const jwt = require("jsonwebtoken");

// auth middleware check whether the user authenticated or not
const auth = require("./auth");

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

// This section will help you get a list of all the users.
userRoutes.route("/user").get(function (req, res) {
  let db_connect = dbo.getDb("auctionZone");
  db_connect
    .collection("users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single user by id
userRoutes.route("/user/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").findOne(myquery, function (err, result) {
    if (err) throw err;
    setTimeout(() => {
      res.json(result);
    }, 1000);
  });
});

// This section will help you create (register) a new user.
userRoutes
  .route("/user/add")
  .post(upload.single("photo"), async function (req, response) {
    let db_connect = dbo.getDb();
    //  encrypt the password using bcrypt
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      let encryptedPassword = hash;
      const uploadFilename = req.file
        ? req.file.filename
        : "default-profile-picture.jpg";

      let myobj = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: encryptedPassword,
        // confirmPassword: req.body.confirmPassword,
        city: req.body.city,
        state: req.body.state,
        zip: req.body.zip,
        about: req.body.about,
        photo: uploadFilename,
        admin: false,
      };
      // check email already exists
      const emailCheck = await db_connect
        .collection("users")
        .findOne({ email: myobj.email })
        .then((emailCheck) => emailCheck);

      if (emailCheck === null) {
        db_connect.collection("users").insertOne(myobj, function (err, res) {
          // console.log(res);
          if (err) throw err;
          response.send({
            registered: true,
            message: "Account created successfully",
            _id: myobj._id,
          });
        });
      } else {
        response.send({
          registered: false,
          message: "User already registered! Please Log in",
        });
      }
    });
   
  });
   // This section will help you update a user by id.
   userRoutes
   .route("/editProfile/:id")
   .post(upload.single("photo"),function (req, response) {
     console.log("ivide ethi");
     let db_connect = dbo.getDb();
     const uploadFilename = req.file
       ? req.file.filename
       : "default-profile-picture.jpg";
     let myquery = { _id: ObjectId(req.params.id) };
     let newvalues = {
       $set: {
         firstName: req.body.firstName,
         lastName: req.body.lastName,
         phone: req.body.phone,
         city: req.body.city,
         state: req.body.state,
         zip: req.body.zip,
         about: req.body.about,
         photo: uploadFilename,
       },
     };
     db_connect
       .collection("users")
       .updateOne(myquery, newvalues, function (err, res) {
         if (err) throw err;
         // console.log("1 document updated");
         response.send({
           registered: true,
           message: "Profile updated successfully",
           _id: res._id,
         });
       });
   });

// login endpoint
userRoutes.post("/login", (request, response) => {
  // check if email exists
  // User.findOne({ email: request.body.email })
  let db_connect = dbo.getDb();
  const user = db_connect
    .collection("users")
    .findOne({ email: request.body.email })

    // if email exists
    .then((user) => {
      // compare the password entered and the hashed password found
      bcrypt
        .compare(request.body.password, user.password)

        // if the passwords match
        .then((passwordCheck) => {
          // check if password matches
          if (!passwordCheck) {
            return response.status(400).send({
              login: false,
              message: "Password does not match",
              error,
            });
          }

          //   create JWT token
          const token = jwt.sign(
            {
              userId: user._id,
              userEmail: user.email,
            },
            "RANDOM-TOKEN",
            { expiresIn: "24h" }
          );

          //   return success response
          response.status(200).send({
            login: true,
            message: "Login Successful",
            email: user.email,
            userId: user._id,
            userName: user.firstName + " " + user.lastName,
            token,
          });
        })
        // catch error if password does not match
        .catch((error) => {
          response.status(400).send({
            message: "Passwords does not match",
            error,
          });
        });
    })
    // catch error if email does not exist
    .catch((e) => {
      response.status(404).send({
        login: false,
        message: "Email not found",
        e,
      });
    });
});

// auth testing remove this after testing
userRoutes.get("/auth-endpoint", auth, (request, response) => {
  response.json({ message: "You are authorized to access me" });
});

// This section will help you delete a user
userRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  db_connect.collection("users").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    // console.log("1 document deleted");
    response.json(obj);
  });
});

// This section will help you get list of notifications for a user
userRoutes.route("/notifications/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { userId: req.params.id };
  db_connect
    .collection("winners")
    .find(myquery)
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});
// This section will help you get list of notifications for a user
userRoutes.route("/notifications/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { userId: req.params.id };
  db_connect
    .collection("winners")
    .find(myquery)
    .sort({ _id: -1 })
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you update a notification by id.
userRoutes.route("/notiUpdate/:id").get(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params.id) };
  let newvalues = {
    $set: {
      delivered: true,
    },
  };
  db_connect
    .collection("winners")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      // console.log("1 document updated");
      response.json(res);
    });
});
module.exports = userRoutes;
