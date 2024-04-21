const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    doctor_firstname: {
      type: String,
      required: [true, "First name is required"],
    },
    doctor_lastname: {
      type: String,
      required: [true, "Last name is required"],
    },
    doctor_email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    doctor_password: {
      type: String,
      required: [true, "Password is required"],
    },
    doctor_specialty: {
      type: String,
      required: [true, "Specialty is required"],
    },
    doctor_phone: {
      type: String,
      required: [true, "Phone number is required"],
    },
    doctor_cin: {
      type: String,
      required: [true, "Phone cin is required"],
    },
    doctor_profile_picture: {
      type: String,
      required: false,
    },
    doctor_profile_description: {
      type: String,
      required: [true, "Profile description is required"],
    },
    doctor_certifications: [
      {
        doctor_certification_name: {
          type: String,
          required: false,
        },
        doctor_certification_image: {
          type: String,
          required: false,
        },
      },
    ],
    doctor_cabinet: {
      doctor_cabinet_name: {
        type: String,
        required: [true, "Cabinet name is required"],
      },
      doctor_cabinet_images: [
        {
          type: String,
          required: false,
        },
      ],
      doctor_cabinet_address: {
        doctor_cabinet_address_street: {
          type: String,
          required: [true, "Street is required"],
        },
        doctor_cabinet_address_city: {
          type: String,
          required: [true, "City is required"],
        },
        doctor_cabinet_address_country: {
          type: String,
          required: [true, "Country is required"],
        },
        doctor_cabinet_address_coordinates: {
          doctor_cabinet_address_latitude: {
            type: Number,
            required: false,
          },
          doctor_cabinet_address_longitude: {
            type: Number,
            required: false,
          },
        },
      },
    },

    doctor_rdv_history: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rdvModel",
      },
    ],

    doctor_compte_status: {
      type: String,
      required: [true, "Status is required"],
    },
  },
  {
    timestamps: true,
  }
);

const doctorModel = mongoose.model("doctorModel", doctorSchema);

module.exports = doctorModel;
