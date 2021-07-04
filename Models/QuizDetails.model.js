const express = require("express");
const mongoose = require("mongoose");

const QuizDetailSchema = new mongoose.Schema({
  themeName: { type: String, required: "theme name is missing" },
  themeImage: { type: String, required: "theme Image is missing" },
  themeDescription: { type: String, required: "theme description missing" },
  themeAccentPrimary: { type: String },
  themeAccentSecondary: { type: String },
});

const QuizDetail = mongoose.model("QuizDetail", QuizDetailSchema);

async function populateQuizDetails(data) {
  for (let i of data) {
    const newQuizDetail = new QuizDetail({
      themeName: i.themeName,
      themeImage: i.themeImage,
      themeDescription: i.themeDescription,
      themeAccentPrimary: i.themeAccentPrimary,
      themeAccentSecondary: i.themeAccentSecondary,
    });
    await newQuizDetail.save();
  }
}

module.exports = { QuizDetail, populateQuizDetails };
