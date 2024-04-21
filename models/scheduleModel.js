const { Schema, Types, model } = require("mongoose");

const scheduleSchema = new Schema(
  {
    doctorId: {
      type: Types.ObjectId,
      required: true,
      ref: "ModelsDoctores",
    },
    day: {
      type: String,
      required: true,
    },
    morning: {
      Start_Time: {
        type: String,
        required: false,
      },
      End_Time: {
        type: String,
        required: false,
      },
    },
    evening: {
      Start_Time: {
        type: String,
        required: false,
      },
      End_Time: {
        type: String,
        required: false,
      },
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = model("Schedule", scheduleSchema);
module.exports = Schedule;
