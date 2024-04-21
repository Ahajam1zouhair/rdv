const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctor_firstname: {
      type: String,
      required: true,
    },
    doctor_lastname: {
      type: String,
      required: true,
    },
    doctor_Date_of_Birth: {
      type: String,
      required: true,
    },
    doctor_email: {
      type: String,
      required: true,
      unique: true,
    },
    doctor_password: {
      type: String,
      required: true,
    },
    doctor_specialty: {
      type: String,
      required: true,
    },
    doctor_phone: {
      type: String,
      required: true,
    },
    doctor_cin: {
      type: String,
      required: true,
    },
    doctor_profile: {
      type: String,
      required: false,
    },
    doctor_profile_description: {
      type: String,
      required: false,
    },
    doctor_certifications: [
      {
        certification_name: {
          type: String,
          required: false,
        },
        certification_anne: {
          type: String,
          required: false,
        },
      },
    ],
    isDoctor: {
      type: Boolean,
      default: false,
    },
    doctor_compte_status: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ModelsDoctores = mongoose.model("ModelsDoctores", doctorSchema);

module.exports = ModelsDoctores;
