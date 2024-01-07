const jwt = require("jsonwebtoken");
const QuestionBank = require("../../models/questionbank.model");

/* validate params  */
const isValid = (value) => {
  if (!value || value?.length === 0) return false;
  return true;
};

/* add question to question-bank */
const addQuestion = async (req, res) => {
  const {
    companyID,
    title,
    description,
    images,
    solution,
    code,
    type,
    topic,
    link,
    testCases,
    extra,
  } = req.body;

  if (!isValid(companyID)) {
    return res.status(400).send({
      status: false,
      message: "Company ID is missing",
    });
  }

  if (!isValid(title)) {
    return res.status(400).send({
      status: false,
      message: "Mandatory fields are missing",
    });
  }

  const payload = {
    companyID,
    title,
    description,
    images,
    solution,
    code,
    type,
    topic,
    link,
    testCases,
    extra,
  };
  try {
    const question = await new QuestionBank(payload).save();

    return res.status(200).send({
      status: true,
      message: "Question added successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: JSON.stringify(error),
    });
  }
};

const getAllQuestions = async(req,res) => {
    try
    {
        const questions = await QuestionBank.find().populate("companyID");
        const count = await QuestionBank.find().countDocuments();
        const data = {
          data:questions,
          metadata: {
              total: count,
          }
        }
        return res.status(200).send({
          status: true,
          data: data,
          message: "Data is fetched successfully",
        });
    }
    catch(error)
    {
        return res.status(500).send({
          status: false,
          message: "Some error Occurred",
          error: JSON.stringify(error),
        });
    }
}
module.exports = {
  addQuestion,
  getAllQuestions,
};
