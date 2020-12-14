const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

router.post("/insertUser", usersController.insertUser);
router.post("/getUserByMail", usersController.getUserByMail);

module.exports = router;
