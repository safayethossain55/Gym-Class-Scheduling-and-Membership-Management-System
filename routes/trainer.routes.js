const express = require("express");
const router = express.Router();

const { loginTrainer, viewTrainerSchedule, logout } = require("../controllers/trainer.controller");
const auth = require("../middlewares/auth.middleware.js");
const allowRoles = require("../middlewares/role.middleware.js");

// Public route: login
router.post("/loginTrainer", loginTrainer);

// Protected routes — only trainers allowed
router.get("/viewSchedule", auth, allowRoles(['trainer']), viewTrainerSchedule);
router.post("/logoutTrainer", auth, allowRoles(['trainer']), logout);

module.exports = router;
