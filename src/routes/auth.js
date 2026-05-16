const express = require("express");
const authRouter = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models/user");
const { validateSignUpData } = require("../utils/validation");

// post /signup add user
authRouter.post("/signup", async (req, res) => {
  try {
    //validation of data
    validateSignUpData(req);
    //encrption of data
   const {
  password,
  firstName,
  lastName,
  emailID,
  age,
  gender,
  phoneNumber,
  photoURL,
  about,
  skills,
} = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    // creating instance of data
   const user = new User({
  firstName,
  lastName,
  emailID,
  age,
  gender,
  phoneNumber,
  photoURL,
  about,
  skills,
  password: passwordHash,
});

    await user.save();
   res.json({
   message:"user added successfully",
   data:user
})
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// post /login
authRouter.post("/login", async (req, res) => {
  try {
    const { emailID, password } = req.body;
    const user = await User.findOne({ emailID: emailID });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isPassword = await user.validatePassword(password);
    if (isPassword) {
      //create jwt token
      const token = await user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
      // add with cookie send to user
      res.json({
        message:"login successfull!",
        data: user,
      });
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

// post /logout

authRouter.post("/logout", async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });
    res.send("logout successfully");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = { authRouter };
