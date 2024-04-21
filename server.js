const express = require("express");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const { corsOptions } = require("./config/corsOptions");
const cors = require("cors");
const port = process.env.PORT;

const app = express();

connectDB();

//! Configuration CORS
// Configuration CORS
app.use(cors(corsOptions));

//!middleware json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//!routes
app.use("/rdvs", require("./routes/rdvRoutes"));
app.use("/patient", require("./routes/patientRoutes"));
app.use("/doctor", require("./routes/doctorRoutes"));
app.use("/admin", require("./routes/adminRoutes"));

//!error middleware
app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
