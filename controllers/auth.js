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

    //console.log(result);
    await CompanyProfile.create({ companyName, userId: result._id });

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
