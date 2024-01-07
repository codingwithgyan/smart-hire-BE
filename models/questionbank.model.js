const mongoose = require("mongoose");
const { QUESTION_STATUS } = require("../constants/index");
const { PUBLIC, PRIVATE } = QUESTION_STATUS;
const questionBankSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required:true,
    },
    title: {
        type: String,
        required:true,
    },
    description: {
        type: String,
        required:true,
    },
    images: {
        type: Array,
    },
    solution: {
        type: String,
    },
    code: {
        type: String,
    },
    type: {
        type: String,
        default: PUBLIC,
        enum: [PUBLIC, PRIVATE],
    },
    topic: {
        type: String,
    },
    link: {
        type: String,
    },
    testCases: {
        type: Array,
    },
    extra: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true,
  })

module.exports = new mongoose.model("questionbanks",questionBankSchema);