const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ValidateCreateDocter,
  ValidateLoginDocter,
  ValidateUpdateDocter,
} = require("../requests/doctorRequest.js");
const asyncHandler = require("express-async-handler");
const doctorModel = require("../models/doctorModelstest");

// @desc    Register a new Doctor
// @route   POST /api/signup
// @access  Public
const registerDoctor = asyncHandler(async (req, res) => {
  const { error } = ValidateCreateDocter(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const {
    doctor_firstname,
    doctor_lastname,
    doctor_email,
    doctor_password,
    doctor_specialty,
    doctor_phone,
    doctor_cin,
    doctor_profile,
    doctor_profile_description,
    doctor_Date_of_Birth,
  } = req.body;

  let doctor = await doctorModel.findOne({ doctor_email });

  if (doctor) {
    return res.status(400).json({ message: "Email already exists" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(doctor_password, salt);

  doctor = new doctorModel({
    doctor_firstname,
    doctor_lastname,
    doctor_email,
    doctor_password: hashedPassword,
    doctor_specialty,
    doctor_phone,
    doctor_cin,
    doctor_profile,
    doctor_profile_description,
    doctor_Date_of_Birth,
    isDoctor: true,
  });
  const result = await doctor.save();
  const token = jwt.sign(
    {
      id: doctor._id,
      isDoctor: doctor.isDoctor,
      compte_status: doctor.doctor_compte_status,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
  res.status(201).json({
    _id: result._id,
    doctor_firstname: result.doctor_firstname,
    doctor_lastname: result.doctor_lastname,
    doctor_email: result.doctor_email,
    doctor_specialty: result.doctor_specialty,
    doctor_phone: result.doctor_phone,
    doctor_profile_picture: result.doctor_profile,
    doctor_profile_description: result.doctor_profile_description,
    doctor_certifications: result.doctor_cin,
    doctor_Date_of_Birth: result.doctor_Date_of_Birth,
    compte_status: result.doctor_compte_status,
    token,
  });
});
// @desc    loginDoctor  Doctor
// @route   POST /api/login
// @access  Public
const loginDoctor = asyncHandler(async (req, res) => {
  const { error } = ValidateLoginDocter(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { doctor_email, doctor_password } = req.body;

  try {
    let doctor = await doctorModel.findOne({ doctor_email });
    if (!doctor) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(
      doctor_password,
      doctor.doctor_password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: doctor._id,
        isDoctor: doctor.isDoctor,
        compte_status: doctor.doctor_compte_status,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );

    res.status(201).json({
      _id: doctor._id,
      doctor_firstname: doctor.doctor_firstname,
      doctor_lastname: doctor.doctor_lastname,
      doctor_email: doctor.doctor_email,
      compte_status: doctor.doctor_compte_status,
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

// @desc    Update Doctor
// @route   PUT /api/doctor/:id
// @access  update
const updateDoctor = asyncHandler(async (req, res) => {
  const { error } = ValidateUpdateDocter(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  let doctor = await doctorModel.findById(req.params.id);

  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  } else if (req.params.id !== req.doctor.id) {
    return res.status(401).json({
      error: "You are not allowed, you can only update your own profile",
    });
  } else {
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatedDoctor);
  }
});

// @desc    get Cabinet Doctor
// @route   GET /api/doctor/cabinet/:id
// @access  Private
const getByIdDoctor = asyncHandler(async (req, res) => {
  const doctor = await doctorModel
    .findById(req.params.id)
    .select("-doctor_password");

  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  } else if (req.params.id !== req.doctor.id) {
    return res.status(401).json({
      error: "You are not allowed, you can only update your own profile",
    });
  } else {
    res.status(200).json(doctor);
  }
});

// @desc    Change Password  Doctor
// @route   POST /api/changePassword
// @access  Private

const changePasswordDoctor = asyncHandler(async (req, res) => {
  const { doctor_password, new_password } = req.body;

  const doctor = await doctorModel.findById(req.params.id);
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  if (req.doctor.id !== req.params.id) {
    return res.status(401).json({
      error: "You are not allowed, you can only update your own profile",
    });
  }

  const isPasswordValid = await bcrypt.compare(
    doctor_password,
    doctor.doctor_password
  );
  if (!isPasswordValid) {
    return res.status(400).json({ error: "Invalid password" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(new_password, salt);
  const updatedDoctor = await doctorModel.findByIdAndUpdate(
    req.params.id,
    { doctor_password: hashedPassword },
    { new: true }
  );

  res.status(200).json(updatedDoctor);
});
module.exports = {
  registerDoctor,
  loginDoctor,
  getByIdDoctor,
  updateDoctor,
  changePasswordDoctor,
};
