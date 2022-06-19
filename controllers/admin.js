import CompanyProfile from "../models/companyProfile.js";
import Message from "../models/message.js";
import Promotion from "./../models/promotion.js";

export const getAllPromotions = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  await Promotion.find()
    .then((promotions) => {
      // console.log(promotions);
      res.status(200).json(promotions);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

export const updatePromotionStatus = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  const { promotionId, status } = req.body;
  let companyId;

  try {
    await Promotion.findOne(
      { _id: promotionId },
      { _id: 0, companyId: 1 }
    ).then((company) => {
      companyId = company.companyId.toString();
    });

    await Promotion.findOneAndUpdate({ _id: promotionId }, { status: status });

    if (status === "Approved") {
      await CompanyProfile.findOneAndUpdate(
        { _id: companyId },
        { isPromoted: true }
      );
    }

    if (status === "Closed") {
      await CompanyProfile.findOneAndUpdate(
        { _id: companyId },
        { isPromoted: false }
      );
    }

    await Promotion.find()
      .then((promotions) => {
        // console.log(promotions);
        res.status(200).json(promotions);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllMessages = async (req, res) => {
  if (!req.authenticationId) {
    return res.json({
      message: "Your are not authorized to perform this action",
    });
  }
  await Message.find()
    .then((messages) => {
      res.status(200).json(messages);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};
