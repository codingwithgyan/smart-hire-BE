const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {CLIENT_ROLES} = require("../constants/index");
const {SUPERADMIN} = CLIENT_ROLES;
const superUserSchema = mongoose.Schema({
    name: {
        type: String,
        required:true,
    },
    email: {
        type: String,
        required:true,
        unique: true,
    },
    phone: {
      type: String,
      required:true,
      unique: true,
    },
    password: {
        type: String,
        required:true,
    },
    role: {
      type:String,
      default:SUPERADMIN,
      enum: SUPERADMIN,

    }
}, {
    versionKey: false,
    timestamps: true,
  })



  superUserSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    this.password = bcrypt.hashSync(this.password, 8);
    return next();
  });

  superUserSchema.methods.comparePassword = function (password) {
    const hashedPassword = this.password;
    return bcrypt.compareSync(password, hashedPassword);
  };

module.exports = new mongoose.model("superusers",superUserSchema);