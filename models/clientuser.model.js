const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { USER_STATUS, CLIENT_ROLES } = require("../constants/index");
const { ACTIVE, INACTIVE } = USER_STATUS;
const { ADMIN, USER } = CLIENT_ROLES;
const clientUserSchema = mongoose.Schema({
    companyID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required:true,
    },
    name: {
        type: String,
        required:true,
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
    password: {
        type: String,
        required:true,
    },
    profilePic: {
        type: String,
    },
    role: {
        type: String,
        default: ADMIN,
        enum : [ADMIN, USER],
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



  clientUserSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    return next();
  });

  clientUserSchema.methods.comparePassword = function (password) {
    const hashedPassword = this.password;
    return bcrypt.compareSync(password, hashedPassword);
  };

module.exports = new mongoose.model("clientusers",clientUserSchema);