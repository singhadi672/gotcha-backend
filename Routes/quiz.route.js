const express = require("express");
const router = express.Router();
const { QuizQuestion } = require("../Models/QuizQuestions.model");

router.route("/").get(async (req, res) => {
  try {
    const response = await QuizQuestion.find({})
      .populate("quizDetail")
      .select("-__v");
    res.status(200).json({ success: true, quiz: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
});

router.route("/:quizId").get(async (req, res) => {
  const { quizId } = req.params;
  try {
    const response = await QuizQuestion.findOne({
      quizDetail: quizId,
    }).populate("quizDetail");
    res.status(200).json({ success: true, quiz: response });
  } catch (error) {
    console.log(err);
    res.status(500).json({ success: false, message: "something went wrong" });
  }
});

module.exports = router;
