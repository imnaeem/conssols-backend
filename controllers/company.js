import CompanyProfile from "../models/companyProfile.js";
import UserProfile from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Portfolio from "./../models/portfolio.js";
import Proposal from "../models/proposal.js";
import Project from "./../models/project.js";
import Review from "../models/review.js";
import Promotion from "../models/promotion.js";

export const updateCompany = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  const updatedCompany = req.body;

  try {
    const checkUsername = await CompanyProfile.findOne({
      $and: [
        { username: req.body.username },
        { userId: { $ne: req.body.userId } },
      ],
    });
    if (checkUsername) {
      res.status(400).json({ message: "Username already taken!" });
    } else {
      const address = updatedCompany.address;
      address.formatted =
        address.streetAddress +
        ", " +
        address.city +
        ", " +
        address.state +
        ", " +
        address.country;

      const updated = await CompanyProfile.findOneAndUpdate(
        { userId: updatedCompany.userId },
        updatedCompany,
        {
          new: true,
        },
        (err) => {
          if (err) console.log(err);
        }
      ).clone();
      res.status(200).json(updated);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyProfile = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.query.id);
  try {
    const company = await CompanyProfile.findOne({ userId: req.query.id });
    //console.log(company);
    //company.create(email)

    company["reviews"] = undefined;
    company["registerAt"] = undefined;
    company["__v"] = undefined;

    //console.log(company);

    res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getCompanyUser = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  // console.log(req.query.id);
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

export const updateCompanyUser = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.body.email);
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

    // console.log(oldUser.email);

    let updatedUser;
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

    const newUser = await UserProfile.findOneAndUpdate(
      { email: email },
      updatedUser,
      {
        new: true,
      }
    );

    //console.log(newUser.email);

    res.status(200).json(newUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const addCompanyPortfolio = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  const portfolio = req.body;
  await Portfolio.create(portfolio)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const getCompanyPortfolio = async (req, res) => {
  //console.log(req.query.id);
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }

  await Portfolio.find({ userId: req.query.id })
    .then((portfolio) => {
      res.status(200).json(portfolio);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const getCompanyProposals = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  // console.log(req.query.id);
  // console.log(req.query.projectId);

  try {
    if (req.query.projectId) {
      await Project.findOne({ _id: req.query.projectId })
        .then((project) => {
          //console.log(project);
          res.status(200).json(project);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    } else if (req.query.id) {
      await Proposal.find({ userId: req.query.id })
        .then((proposal) => {
          res.status(200).json(proposal);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const markProjectCompleted = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.body);
  const companyId = await CompanyProfile.findOne(
    { userId: req.body.userId },
    { _id: 1 }
  );

  await Project.findOneAndUpdate(
    { _id: req.body.projectId },
    { $set: { status: "completed", completedBy: companyId._id.toString() } },
    { new: true }
  )
    .then((project) => {
      res.status(200).json(project);
      //console.log(project);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const getCompanyReviews = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.query.id);

  try {
    const companyId = await CompanyProfile.findOne(
      { userId: req.query.id },
      { _id: 1 }
    );
    // console.log(companyId);

    // const reviews = await Review.find({ companyId: companyId._id.toString() });

    // console.log(reviews);

    await Review.aggregate([
      { $match: { companyId: companyId._id } },
      {
        $lookup: {
          from: "projects",
          localField: "projectId",
          foreignField: "_id",
          as: "project",
        },
      },
      {
        $lookup: {
          from: "userprofiles",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user",
      },
      {
        $unwind: "$project",
      },

      {
        $project: {
          title: 1,
          details: 1,
          score: 1,
          reviewedAt: 1,
          project: 1,
          reviewImage: 1,
          user: {
            firstName: 1,
            lastName: 1,
          },
        },
      },
    ])
      .then((reviews) => {
        // console.log(reviews);
        res.status(200).json(reviews);
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteCompanyPortfolio = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.query);
  try {
    await Portfolio.findByIdAndRemove(req.query.portfolioId);

    await Portfolio.find({ userId: req.query.userId })
      .then((portfolio) => {
        res.status(200).json(portfolio);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const promoteCompany = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.body);

  const { userId, title, duration, cost } = req.body;

  const companyId = await CompanyProfile.findOne(
    { userId: userId },
    { _id: 1 }
  );

  await Promotion.create({
    companyId: companyId._id.toString(),
    title,
    duration,
    cost,
  })
    .then((promotion) => {
      //console.log(promotion);
      res.status(200).json(promotion);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const getCompanyPromotions = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  const companyId = await CompanyProfile.findOne(
    { userId: req.query.id },
    { _id: 1 }
  );

  await Promotion.find({ companyId: companyId._id.toString() })
    .then((promotions) => {
      //console.log(promotions);
      res.status(200).json(promotions);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};
