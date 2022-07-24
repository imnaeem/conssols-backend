import mongoose from "mongoose";
import UserProfile from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import CompanyProfile from "./../models/companyProfile.js";

const secret = "test";

export const signup = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    companySignup,
    companyName,
  } = req.body;

  try {
    const oldUser = await UserProfile.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Password does not match" });

    if (companySignup && (companyName == "" || companyName == null))
      return res.status(400).json({ message: "Company Name is Required" });

    let type;

    if (companySignup) {
      type = "company";
    } else {
      type = "client";
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserProfile.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      companySignup,
      type,
    });

    if (companySignup) {
      await CompanyProfile.create({ companyName, userId: result._id });
    }

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: "2h",
    });

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const oldUser = await UserProfile.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "2h",
    });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getUserProfile = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.query.id);
  try {
    const user = await UserProfile.findOne({ _id: req.query.id });

    user["registerAt"] = undefined;
    user["__v"] = undefined;
    user["companySignup"] = undefined;
    user["password"] = undefined;

    //console.log(user);
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }

  const {
    firstName,
    lastName,
    email,
    oldPassword,
    newPassword,
    userImage,
    updatePassword,
  } = req.body;

  try {
    const oldUser = await UserProfile.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    let updatedUser;

    if (req.body._id) {
      if (updatePassword) {
        const isPasswordCorrect = await bcrypt.compare(
          oldPassword,
          oldUser.password
        );

        //console.log(isPasswordCorrect);

        if (!isPasswordCorrect)
          return res.status(400).json({ message: "Old Password is incorrect" });

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        updatedUser = {
          firstName,
          lastName,
          userImage,
          password: hashedPassword,
        };

        // updatedUser.password = hashedPassword;
      } else {
        updatedUser = {
          firstName,
          lastName,
          userImage,
        };
      }
    } else {
      updatedUser = {
        userImage,
      };
    }

    const newUser = await UserProfile.findOneAndUpdate(
      { email: email },
      updatedUser,
      {
        new: true,
      }
    );
    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
