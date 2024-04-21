const { Types } = require("mongoose");
const mongoose = require("mongoose");

const Schemacabinet = new mongoose.Schema(
  {
    doctor_id: {
      type: Types.ObjectId,
      required: true,
      ref: "ModelsDoctores",
    },
    cabinet_name: {
      type: String,
      required: true,
    },
    cabinet_images: [
      {
        type: String,
        required: false,
      },
    ],
    cabinet_address_coordinates: {
      type: String,
      required: true,
    },
    cabinet_address_city: {
      type: String,
      required: true,
    },
    cabinet_address_country: {
      type: String,
      required: true,
    },
    cabinet_address_longitude: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Cabinet = mongoose.model("Cabinet", Schemacabinet);

module.exports = Cabinet;
