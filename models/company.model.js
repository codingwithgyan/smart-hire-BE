const mongoose = require("mongoose");
const { USER_STATUS } = require("../constants/index");
const { ACTIVE, INACTIVE } = USER_STATUS;
const companySchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    logo: {
        type: String,
    },
    phone: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    status: {
        type: String,
        default: ACTIVE,
        enum: [ACTIVE, INACTIVE],
    },
    extra: {
        type: String,
    },
}, {
    versionKey: false,
    timestamps: true,
  })

module.exports = new mongoose.model("companies",companySchema);