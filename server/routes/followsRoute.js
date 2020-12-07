const express = require("express");
const router = express.Router();

const followsController = require("../controllers/followsController");

router.get("/getAllFollows", followsController.getAllFollows);
router.post("/insertFollows", followsController.insertFollows);
router.post("/deleteFollows", followsController.deleteFollows);

module.exports = router;
