import CompanyProfile from "../models/companyProfile.js";
import UserProfile from "../models/user.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Project from "./../models/project.js";
import Proposal from "../models/proposal.js";
import Review from "./../models/review.js";
import Message from "../models/message.js";

export const getComapnies = async (req, res) => {
  try {
    await CompanyProfile.aggregate([
      { $match: { username: { $ne: "" } } },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "companyId",
          as: "reviews",
        },
      },

      {
        $sort: {
          isPromoted: -1,
        },
      },
    ])
      .then((companies) => {
        res.status(200).json(companies);
      })
      .catch((err) => res.status(200).json(err));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getProjects = async (req, res) => {
  const userId = req.query.id;
  //console.log(userId);

  if (userId) {
    Project.aggregate([
      {
        $match: {
          $expr: {
            $eq: ["$status", "active"],
          },
        },
      },
      {
        $lookup: {
          from: "proposals",
          localField: "_id",
          foreignField: "projectId",
          as: "proposals",
        },
      },
      {
        $set: {
          uids: "$proposals.userId",
        },
      },
      {
        $unset: "proposals",
      },
      {
        $match: {
          $expr: {
            $not: [
              {
                $in: [mongoose.Types.ObjectId(userId), "$uids"],
              },
            ],
          },
        },
      },
      {
        $unset: "uids",
      },
    ])
      .then((project) => {
        //console.log(project);
        res.status(200).json(project);
      })
      .catch((err) => res.status(404).json(err));
  } else {
    await Project.find({ status: "active" })
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((err) => {
        res.status(500).json({ message: "Somethisssng went wrong" });
      });
  }

  // try {
  //   const activeProjects = await Project.find({ status: "active" }, { _id: 1 });

  //   const projectsWithProposals = await Proposal.find(
  //     {
  //       $and: [
  //         { userId: req.query.id },
  //         { projectId: { $in: activeProjects } },
  //       ],
  //     },
  //     { _id: 0, projectId: 1 }
  //   );

  //   const stringsIds = projectsWithProposals.map((id) =>
  //     id.projectId.toString()
  //   );

  //   const projects = await Project.find({
  //     $and: [{ status: "active" }, { _id: { $nin: stringsIds } }],
  //   });
  //   res.status(200).json(projects);
  // } catch (error) {
  //   res.status(404).json({ message: error.message });
  // }
};

export const sendProposal = async (req, res) => {
  const proposal = req.body;
  //console.log(proposal);

  await Proposal.create(proposal)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: "Somethisssng went wrong" });
    });
};

export const getCurrentCompany = async (req, res) => {
  //console.log(req.query.id);
  try {
    // const company = await CompanyProfile.findOne({
    //   username: req.query.username,
    // });
    // console.log(company);

    await CompanyProfile.aggregate([
      { $match: { username: req.query.username } },
      {
        $lookup: {
          from: "portfolios",
          localField: "userId",
          foreignField: "userId",
          as: "portfolios",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "companyId",
          as: "reviews",
        },
      },
    ])
      .then((reviews) => {
        //console.log(reviews);
        res.status(200).json(reviews);
      })
      .catch((err) => res.status(500).json({ message: err.message }));

    //res.status(200).json(company);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const currentCompanyReviews = async (req, res) => {
  // console.log(req.query.username);

  try {
    const companyId = await CompanyProfile.findOne(
      { username: req.query.username },
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
      .catch((err) => console.log(err));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendMessage = async (req, res) => {
  await Message.create(req.body)
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const getSearchedCompanies = async (req, res) => {
  var promoted = req.query.featured === "true";

  let query;

  if (req.query.employees === "" && req.query.rate === "") {
    query = {
      $match: {
        $and: [{ username: { $ne: "" } }, { isPromoted: { $eq: promoted } }],
      },
    };
  }

  if (req.query.employees !== "" && req.query.rate !== "") {
    query = {
      $match: {
        $and: [
          { rate: { $eq: req.query.rate } },
          { employees: { $eq: req.query.employees } },
          { username: { $ne: "" } },
          { isPromoted: { $eq: promoted } },
        ],
      },
    };
  }

  if (req.query.employees !== "" && req.query.rate === "") {
    query = {
      $match: {
        $and: [
          { employees: { $eq: req.query.employees } },
          { username: { $ne: "" } },
          { isPromoted: { $eq: promoted } },
        ],
      },
    };
  }

  if (req.query.employees === "" && req.query.rate !== "") {
    query = {
      $match: {
        $and: [
          { rate: { $eq: req.query.rate } },
          { username: { $ne: "" } },
          { isPromoted: { $eq: promoted } },
        ],
      },
    };
  }

  try {
    await CompanyProfile.aggregate([
      query,
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "companyId",
          as: "reviews",
        },
      },

      {
        $sort: {
          isPromoted: -1,
        },
      },
    ])
      .then((companies) => {
        res.status(200).json(companies);
      })
      .catch((err) => res.status(200).json(err));
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
