import CompanyProfile from "../models/companyProfile.js";
import UserProfile from "../models/user.js";
import bcrypt from "bcryptjs";
import Project from "./../models/project.js";
import Proposal from "./../models/proposal.js";
import mongoose from "mongoose";
import Review from "../models/review.js";

export const addClientProject = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  const project = req.body;
  //console.log(project);
  await Project.create(project)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Somethisssng went wrong" });
    });
};

export const getClientProjects = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //   console.log(req.query.projectId);

  try {
    if (req.query.projectId) {
      await Proposal.find({ projectId: req.query.projectId })
        .then((project) => {
          if (project) {
            res.status(200).json(project);
          } else {
            res.status(200).json("No proposals found");
          }
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    } else if (req.query.id) {
      await Project.find({ userId: req.query.id })
        .then((projects) => {
          res.status(200).json(projects);
        })
        .catch((err) => {
          res.status(500).json({ message: err.message });
        });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const closeClientProject = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  await Project.findOneAndUpdate(
    { _id: req.body.id },
    { $set: { status: "closed" } },
    { new: true }
  )
    .then((project) => {
      res.status(200).json(project);
      //console.log(project);
    })
    .catch((err) => {
      res.status(500).json({ message: "Somethisssng went wrong" });
    });
};

export const acceptCompanyProposal = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //console.log(req.body.proposalId);
  await Proposal.findOneAndUpdate(
    { _id: req.body.proposalId },
    { $set: { status: "Accepted" } },
    { new: true }
  )
    .then((proposal) => {
      res.status(200).json(proposal);
      // console.log(proposal);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const getProposalCompany = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  // console.log(req.query.proposalId);

  try {
    const proposal = await Proposal.findOne(
      { _id: req.query.proposalId },
      { userId: 1, _id: 0 }
    );

    await CompanyProfile.findOne({ userId: proposal.userId.toString() }).then(
      (company) => {
        res.status(200).json(company);
      }
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectsToReview = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  // console.log(req.query.id);

  try {
    await Project.find({
      $and: [
        { userId: req.query.id },
        { status: { $eq: "completed" } },
        { reviewed: { $eq: false } },
      ],
    }).then((projects) => {
      //console.log(projects);
      res.status(200).json(projects);
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};

export const cleintAddReview = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  let review = req.body;

  // console.log(review);

  try {
    await Project.findOneAndUpdate(
      { _id: req.body.projectId },
      { $set: { reviewed: true } }
    );

    const companyId = await Project.findOne(
      { _id: req.body.projectId },
      { completedBy: 1, _id: 0 }
    );

    review["companyId"] = companyId.completedBy.toString();
    //console.log(review);
    const result = await Review.create(review);

    // console.log(result);

    await Project.find({
      $and: [{ userId: req.body.id }, { status: { $eq: "completed" } }],
    }).then((projects) => {
      res.status(200).json(projects);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClientReviews = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  //le.log(req.query.id);
  try {
    await Review.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(req.query.id) } },
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
          from: "companyprofiles",
          localField: "companyId",
          foreignField: "_id",
          as: "company",
        },
      },

      {
        $unwind: "$company",
      },
      {
        $unwind: "$project",
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

  // await Review.find({ userId: req.query.id })
  //   .then((reviews) => {
  //     //res.status(200).json(proposal);
  //     console.log(reviews);
  //   })
  //   .catch((err) => {
  //     res.status(500).json({ message: err.message });
  //   });
};
