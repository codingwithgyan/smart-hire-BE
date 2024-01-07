const jwt = require("jsonwebtoken");
const Company = require("../../models/company.model");
const ClientUser = require("../../models/clientuser.model");
require("dotenv").config();
const bcrypt = require("bcrypt");
const { CLIENT_ROLES } = require("../../constants/index");
const { SUPERADMIN } = CLIENT_ROLES;

/* Generate token for client user */
const generateToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET_TOKEN);
};

/* validate params  */
const isValid = (value) => {
  if (!value || value?.length === 0) return false;
  return true;
};

/* Signup for client users */
const clientUserSignup = async (req, res) => {
  const {
    companyID,
    userName: name,
    userEmail: email,
    userPassword: password,
    userPhone: phone,
  } = req.body;
  if (!isValid(companyID)) {
    return res.status(400).send({
      status: false,
      message: "Company ID is missing",
    });
  }
  if (
    !isValid(name) ||
    !isValid(email) ||
    !isValid(password) ||
    !isValid(phone)
  ) {
    return res.status(400).send({
      status: false,
      message: "User Mandatory fields are missing",
    });
  }
  try {
    let user = await ClientUser.findOne({ email });
    if (user) {
      return res.status(403).send({
        status: false,
        message: "User with this email already exist",
      });
    }
    const payload = {
      companyID,
      name,
      email,
      password,
      phone,
    };
    user = await new ClientUser(payload).save();
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

/* Add Company */

const AddCompany = async (req, res) => {
  const { companyName, companyLogo, companyPhone, companyEmail, companyExtra } =
    req.body;
  if (
    !isValid(companyName) ||
    !isValid(companyPhone) ||
    !isValid(companyEmail)
  ) {
    return res.status(400).send({
      status: false,
      message: "Company Mandatory fields are missing",
    });
  }
  let company = await Company.findOne({ email: companyEmail });
  if (company) {
    return res.status(403).send({
      status: false,
      message: "Company with this email already exist",
    });
  }

  const payload = {
    name: companyName,
    email: companyEmail,
    logo: companyLogo,
    phone: companyPhone,
    extra: companyExtra,
  };
  try {
    company = await new Company(payload).save();
    req.body.companyID = company?._id;
    clientUserSignup(req, res);
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

/* Login for client users */
const clientUserLogin = async (req, res) => {
  const { email, password } = req.body;
  if (!isValid(email) || !isValid(password)) {
    return res.status(403).send({
      status: false,
      message: "Please provide a valid email or password",
    });
  }
  try {
    let user = await ClientUser.findOne({ email });
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
      message: "User logged-in successfully",
      data,
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

const structureClientData = (clients) => {
  const clientList =
    clients?.map(
      ({ _id, companyID, name, phone, email, role, status, createdAt }) => ({
        _id,
        companyID,
        name,
        email,
        phone,
        role,
        status,
        createdAt,
      })
    ) || [];
  return clientList;
};

/*            Get all clients        */
const getAllClients = async (req, res) => {
  const { role } = req?.body?.user;
  if (!role || role !== SUPERADMIN) {
    return res.status(403).send({
      status: false,
      message: "Unauthorized Access",
    });
  }

  try {
    let clients = await ClientUser.find().populate("companyID");
    clients = structureClientData(clients);
    const count = await ClientUser.find().countDocuments();
    const data = {
      data: clients,
      metadata: {
        total: count,
      },
    };

    return res.status(200).send({
      status: true,
      data,
      message: "Data fetched successfully",
    });
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const clientUserEdit = async (req, res) => {
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

  try {
    const user = await ClientUser.findByIdAndUpdate(id, payload);
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
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

const getClientData = async (req, res) => {
  const id = req?.body?.user?._id;
  try {
    const user = await ClientUser.findById(id);
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
  } catch (error) {
    return res.status(500).send({
      status: false,
      message: "Some error Occurred",
      error: error,
    });
  }
};

module.exports = {
  clientUserSignup,
  clientUserLogin,
  AddCompany,
  getAllClients,
  getClientData,
  clientUserEdit,
};
