const express = require("express");
const router = express.Router();
// const { registerDoctor, loginDoctor, getDoctorProfile, updateDoctorProfile } = require('../controllers/doctorController');
const {
  registerDoctor,
  loginDoctor,
  updateDoctor,
  getByIdDoctor,
  changePasswordDoctor,
} = require("../controllers/Doctor");

const {
  createCabinet,
  updateCabinet,
  getByIdCabinet,
} = require("../controllers/cabinetController");
const { doctorAuth, verifyStatus } = require("../middleware/doctorMiddleware");
const {
  createSchedule,
  getSchedule,
  getSchedulebyday,
  updateSchedule,
} = require("../controllers/scheduleController");

router.route("/register").post(registerDoctor);
router.route("/login").post(loginDoctor);
// router.route('/profile').get(doctorAuth, getDoctorProfile);
router
  .route("/:id")
  .put(doctorAuth, updateDoctor)
  .get(doctorAuth, getByIdDoctor);
router.route("/changePassword/:id").put(doctorAuth, changePasswordDoctor);

//  cabinet
router.route("/cabinet").post(doctorAuth, verifyStatus, createCabinet);
router
  .route("/cabinet/:id")
  .put(doctorAuth, updateCabinet)
  .get(doctorAuth, getByIdCabinet);

//  schedule
router.route("/schedule").post(doctorAuth, createSchedule);
router.route("/schedule/:id").get(doctorAuth, getSchedule);
router.route("/updateschedule/:id").put(doctorAuth, updateSchedule);
router.route("/schedule/:id/:day").get(doctorAuth, getSchedulebyday);

module.exports = router;
