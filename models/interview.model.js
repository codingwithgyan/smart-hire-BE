const mongoose = require("mongoose");
const { INTERVIEW_TYPE } = require('../constants/index');
const { UPCOMING, PASSED, FAILED, CANCELLED } = INTERVIEW_TYPE;
const interviewSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required:true,
    },
    candidateName: {
        type: String,
        required:true,
    },
    candidateEmail: {
        type: String,
        required:true,
    },
    candidatePhone: {
        type: String,
        required:true,
    },
    candidateLink: {
        type: String,
        required:true,
    },
    candidateExtra: {
        type: Object,
    },
    interviewerName: {
        type: String,
        required:true,
    },
    interviewerEmail: {
        type: String,
        required:true,
    },
    interviewerPhone: {
        type: String,
        required:true,
    },
    interviewerLink: {
        type: String,
        required:true,
    },
    interviewerExtra: {
        type: Object,
    },
    date: {
        type: Number,
    },
    stage: {
        type: String,
        default: UPCOMING,
        enum: [UPCOMING, PASSED, FAILED, CANCELLED],
    },
    questions: {
        type: Array,
        default: [],
    },
    response: {
        type: Object,
        default: {}
    }

}, {
    versionKey: false,
    timestamps: true,
  })

module.exports = new mongoose.model("interviews",interviewSchema);