const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Doctor = require("../models/doctorModel");

// generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// register doctor
const registerDoctor = asyncHandler(async (req, res) => {
  const {
    doctor_firstname,
    doctor_lastname,
    doctor_email,
    doctor_password,
    doctor_specialty,
    doctor_phone,
    doctor_profile_picture,
    doctor_profile_description,
    doctor_certifications,
    doctor_cabinet,
  } = req.body;

  // check if all fields are filled
  if (
    !doctor_firstname ||
    !doctor_lastname ||
    !doctor_email ||
    !doctor_password ||
    !doctor_specialty ||
    !doctor_phone ||
    !doctor_profile_description ||
    !doctor_cabinet
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // check if doctor already exists
  const doctorExists = await Doctor.findOne({ doctor_email });

  if (doctorExists) {
    res.status(400);
    throw new Error("Doctor already exists");
  }

  // hash password
  const salt = await bcrypt.genSalt(10);
  const doctor_hashedPassword = await bcrypt.hash(doctor_password, salt);

  // create doctor
  const doctor = await Doctor.create({
    doctor_firstname,
    doctor_lastname,
    doctor_email,
    doctor_password: doctor_hashedPassword,
    doctor_specialty,
    doctor_phone,
    doctor_profile_picture,
    doctor_profile_description,
    doctor_certifications,
    doctor_cabinet,
  });

  if (doctor) {
    res.status(201).json({
      _id: doctor._id,
      doctor_firstname: doctor.doctor_firstname,
      doctor_lastname: doctor.doctor_lastname,
      doctor_email: doctor.doctor_email,
      doctor_specialty: doctor.doctor_specialty,
      doctor_phone: doctor.doctor_phone,
      doctor_profile_picture: doctor.doctor_profile_picture,
      doctor_profile_description: doctor.doctor_profile_description,
      doctor_certifications: doctor.doctor_certifications,
      doctor_cabinet: doctor.doctor_cabinet,
      token: generateToken(doctor._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid doctor data");
  }
});

// login doctor
const loginDoctor = asyncHandler(async (req, res) => {
  const { doctor_email, doctor_password } = req.body;

  // check if all fields are filled
  if (!doctor_email || !doctor_password) {
    res.status(400);
    throw new Error("All fields are required");
  }

  // check if doctor exists
  const doctor = await Doctor.findOne({ doctor_email });

  // check if doctor exists and password is correct
  if (
    doctor &&
    (await bcrypt.compare(doctor_password, doctor.doctor_password))
  ) {
    res.json({
      _id: doctor._id,
      doctor_firstname: doctor.doctor_firstname,
      doctor_lastname: doctor.doctor_lastname,
      doctor_email: doctor.doctor_email,
      doctor_specialty: doctor.doctor_specialty,
      doctor_phone: doctor.doctor_phone,
      doctor_profile_picture: doctor.doctor_profile_picture,
      doctor_profile_description: doctor.doctor_profile_description,
      doctor_certifications: doctor.doctor_certifications,
      doctor_cabinet: doctor.doctor_cabinet,
      token: generateToken(doctor._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// get doctor profile
const getDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id);

  if (doctor) {
    res.json({
      _id: doctor._id,
      doctor_firstname: doctor.doctor_firstname,
      doctor_lastname: doctor.doctor_lastname,
      doctor_email: doctor.doctor_email,
      doctor_specialty: doctor.doctor_specialty,
      doctor_phone: doctor.doctor_phone,
      doctor_profile_picture: doctor.doctor_profile_picture,
      doctor_profile_description: doctor.doctor_profile_description,
      doctor_certifications: doctor.doctor_certifications,
      doctor_cabinet: doctor.doctor_cabinet,
    });
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// update doctor profile
const updateDoctorProfile = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.doctor._id);
  // check if all fields are filled
  if (doctor) {
    doctor.doctor_firstname =
      req.body.doctor_firstname || doctor.doctor_firstname;
    doctor.doctor_lastname = req.body.doctor_lastname || doctor.doctor_lastname;
    doctor.doctor_email = req.body.doctor_email || doctor.doctor_email;
    doctor.doctor_specialty =
      req.body.doctor_specialty || doctor.doctor_specialty;
    doctor.doctor_phone = req.body.doctor_phone || doctor.doctor_phone;
    doctor.doctor_profile_picture =
      req.body.doctor_profile_picture || doctor.doctor_profile_picture;
    doctor.doctor_profile_description =
      req.body.doctor_profile_description || doctor.doctor_profile_description;
    doctor.doctor_certifications =
      req.body.doctor_certifications || doctor.doctor_certifications;
    doctor.doctor_cabinet = req.body.doctor_cabinet || doctor.doctor_cabinet;
    // save updated doctor
    const updatedDoctor = await doctor.save();
    // return updated doctor
    res.json({
      _id: updatedDoctor._id,
      doctor_firstname: updatedDoctor.doctor_firstname,
      doctor_lastname: updatedDoctor.doctor_lastname,
      doctor_email: updatedDoctor.doctor_email,
      doctor_specialty: updatedDoctor.doctor_specialty,
      doctor_phone: updatedDoctor.doctor_phone,
      doctor_profile_picture: updatedDoctor.doctor_profile_picture,
      doctor_profile_description: updatedDoctor.doctor_profile_description,
      doctor_certifications: updatedDoctor.doctor_certifications,
      doctor_cabinet: updatedDoctor.doctor_cabinet,
    });
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// admin permissions _______________________________________________________

// get all doctors
const getDoctors = asyncHandler(async (req, res) => {
  const doctors = await Doctor.find({});
  res.json(doctors);
});

// get doctor by id
const getDoctorById = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    res.json(doctor);
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// update doctor by id
const updateDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    doctor.doctor_firstname =
      req.body.doctor_firstname || doctor.doctor_firstname;
    doctor.doctor_lastname = req.body.doctor_lastname || doctor.doctor_lastname;
    doctor.doctor_email = req.body.doctor_email || doctor.doctor_email;
    doctor.doctor_specialty =
      req.body.doctor_specialty || doctor.doctor_specialty;
    doctor.doctor_phone = req.body.doctor_phone || doctor.doctor_phone;
    doctor.doctor_profile_picture =
      req.body.doctor_profile_picture || doctor.doctor_profile_picture;
    doctor.doctor_profile_description =
      req.body.doctor_profile_description || doctor.doctor_profile_description;
    doctor.doctor_certifications =
      req.body.doctor_certifications || doctor.doctor_certifications;
    doctor.doctor_cabinet = req.body.doctor_cabinet || doctor.doctor_cabinet;

    const updatedDoctor = await doctor.save();
    res.json(updatedDoctor);
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

// delete doctor by id
const deleteDoctor = asyncHandler(async (req, res) => {
  const doctor = await Doctor.findById(req.params.id);

  if (doctor) {
    await doctor.remove();
    res.json({ message: "Doctor removed" });
  } else {
    res.status(404);
    throw new Error("Doctor not found");
  }
});

module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
