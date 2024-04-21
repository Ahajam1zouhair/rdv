const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const doctorModel = require("../models/doctorModelstest");

const UNAUTHORIZED_ERROR = "Not authorized";
const TOKEN_FAILED_ERROR = "Token failed";

const doctorAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.doctor = await doctorModel
        .findById(decoded.id)
        .select("-doctor_password");
      if (!req.doctor) {
        return res.status(401).json({
          error: "This account does not exist",
        });
      }
      next();
    } catch (error) {
      res.status(401).json({ message: TOKEN_FAILED_ERROR });
      throw new Error(TOKEN_FAILED_ERROR);
    }
  }

  if (!token) {
    res.status(401).json({ message: UNAUTHORIZED_ERROR });
    throw new Error(UNAUTHORIZED_ERROR);
  }
});

const verifyTokenAndAuthorization = (req, res, next) => {
  // Check if req.doctor exists and has the _id property
  if (req.doctor && req.doctor._id === req.params.id) {
    next();
  } else {
    res.status(401).json({
      message: "You are not authorized to access verifyTokenAndAuthorization ",
    });
  }
};
const verifyStatus = (req, res, next) => {
  if (req.doctor.doctor_compte_status === true) {
    next();
  } else {
    res.status(401).json({
      message: "Your account has not been activated yet",
    });
  }
};

module.exports = {
  doctorAuth,
  verifyTokenAndAuthorization,
  verifyStatus,
};
