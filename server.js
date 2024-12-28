const express = require("express");
const dotenv = require('dotenv');
const bodyParser = require("body-parser");
const cors = require("cors");
const appointmentRoutes = require('./Src/routes/appointmentRoutes');
const { createTables } = require('./Src/config/database1');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
// Connect to the database
const { promisePool } = require('./Src/config/database1');

createTables();

// Routes
app.use("/appointments", appointmentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
