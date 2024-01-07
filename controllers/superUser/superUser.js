const jwt = require("jsonwebtoken");
const SuperUser = require("../../models/superuser.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { CLIENT_ROLES } = require("../../constants");

const { SUPERADMIN } = CLIENT_ROLES;

/* Generate token for superuser */
const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_TOKEN);
};

/* validate params  */
const isValid = (value) => {
  if (!value || value?.length === 0) return false;
  return true;
};

/* Signup for super users */
const superUserSignup = async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!isValid(name) || !isValid(email) || !isValid(password)) {
    return res.status(400).send({
      status: false,
      message: "Mandatory fields are missing",
    });
  }
  try {
    let user = await SuperUser.findOne({ email });
    if (user) {
      return res.status(403).send({
        status: false,
        message: "User with this email already exist",
      });
    }
    const payload = {
      name,
      email,
      phone,
      password,
    };
    user = await new SuperUser(payload).save();
    return res.status(200).send({
      status: true,
      message: "User Created successfully",
      token: generateToken(user),
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

/* Login for super users */
const superUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!isValid(email) || !isValid(password)) {
    return res.status(403).send({
      status: false,
      message: "Please provide a valid email or password",
    });
  }

  try {
    let user = await SuperUser.findOne({ email });
    if (!user) {
      return res.status(403).send({
        status: false,
        message: "Invalid email or password",
      });
    }
    const match = await user.comparePassword(password);
    if (!match) {
      return res.status(403).send({
        status: false,
        message: "Please provide a valid password",
      });
    }

    const data = {
      _id: user.id,
      companyID: user.companyID,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };

    return res.status(201).send({
      status: true,
      data,
      message: "User logged-in successfully",
      token: generateToken(user),
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const superUserEdit = async (req, res) => {
  const { name, email, phone, password } = req.body;
  const id = req.body.user?._id;
  const payload = {};
  if (isValid(name)) {
    payload.name = name;
  }
  if (isValid(email)) {
    payload.email = email;
  }
  if (isValid(phone)) {
    payload.phone = phone;
  }
  if (isValid(password)) {
    payload.password = bcrypt.hashSync(password, 8);
  }
  try
  {
    const user = await SuperUser.findByIdAndUpdate(id, payload);
    const data = {
      _id: user.id,
      companyID: user.companyID,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
    };

    return res.status(200).send({
      status: false,
      message: "User details updated",
      data: data,
    });
  }
  catch(error)
  {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const getSuperAdminData = async(req, res) => {
    const id = req?.body?.user?._id;
    const role = req?.body?.user?.role;
    if(role !== SUPERADMIN)
    {
      return res.status(403).send({
        status: false,
        message: "Unauthorized Access",
      })
    }

    try
    {
      const user = await SuperUser.findById(id);
      const data = {
        _id: user.id,
        companyID: user.companyID,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      };
      return res.status(200).send({
        status: true,
        message: "Data fetched successfully",
        data,
      });
    }
    catch(error)
    {
      return res.status(500).send({
        status: false,
        message: "Some error Occurred",
        error: error,
      });
    }
    
}

module.exports = {
  superUserSignup,
  superUserLogin,
  superUserEdit,
  getSuperAdminData
};
