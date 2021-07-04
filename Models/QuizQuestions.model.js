const express = require("express");
const mongoose = require("mongoose");
const { QuizDetail } = require("./QuizDetails.model");

const QuizQuestionsSchema = new mongoose.Schema({
  quizDetail: { type: mongoose.Schema.Types.ObjectId, ref: "QuizDetail" },
  quizType: { type: String, enum: ["question", "image"] },
  questions: [
    {
      questionNum: Number,
      question: String,
      options: [{ value: String, isCorrect: Boolean }],
    },
  ],
});

const QuizQuestion = mongoose.model("QuizQuestion", QuizQuestionsSchema);

async function populateQuizQuestions(quiz) {
  console.log(quiz.gameName);
  const { _id } = await QuizDetail.findOne({ themeName: quiz.gameName });
  const newQuiz = new QuizQuestion({
    quizDetail: _id,
    quizType: quiz.QuizType,
    questions: quiz.questions,
  });

  await newQuiz.save();
}

module.exports = { QuizQuestion, populateQuizQuestions };
