const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { QuizDetail } = require("../Models/QuizDetails.model");

router.route("/").get(async (req, res) => {
  try {
    const response = await QuizDetail.find({}).select("-__v");
    res.status(200).json({ success: true, quizDetails: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
});

module.exports = router;
