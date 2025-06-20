const express = require("express");
const router = express.Router();

const { registerTrainer, createSchedule } = require("../controllers/admin.controller");
const auth = require("../middlewares/auth.middleware.js");
const allowRoles = require("../middlewares/role.middleware.js");

// Only admin can register trainer and create schedules
router.post("/registerTrainer", auth, allowRoles(['admin']), registerTrainer);
router.post("/createSchedule", auth, allowRoles(['admin']), createSchedule);

module.exports = router;
