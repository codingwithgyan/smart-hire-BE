const mongoose = require("mongoose");
const  { JOB_STATUS, LANGUAGE_SUPPORT} = require("../constants/index");

const {PENDING, SUCCESS, ERROR} = JOB_STATUS;
const {JAVASCRIPT, PYTHON} = LANGUAGE_SUPPORT;
const jobSchema = mongoose.Schema({
    language: {
        type: String,
        required: true,
        enum: [PYTHON.extension,JAVASCRIPT.extension],
    },
    status: {
        type: String,
        default:PENDING,
        enum: [PENDING, SUCCESS, ERROR],
    },
    filePath: {
        type: String,
        required:true,
    },
    output: {
        type: String,
    },
    submittedAt: {
        type: Date,
        default: Date.now,
    },
    startedAt: {
        type: Date,
    },
    completedAt: {
        type: Date,
    },
}, {
    versionKey: false,
    timestamps: true,
  })

module.exports = new mongoose.model("jobs",jobSchema);