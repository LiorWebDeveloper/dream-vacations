const express = require("express");
const router = express.Router();
var multer = require("multer");
const vacationsController = require("../controllers/vacationsController");

var storageObj = multer.diskStorage({
  destination: "./uploads",
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storageObj });

router.post(
  "/addVacation",
  upload.array("uploads[]", 12),
  vacationsController.addVacation
);
router.post(
  "/updateVacation",
  upload.array("uploads[]", 12),
  vacationsController.updateVacation
);

router.get("/getAllVacations", vacationsController.getAllVacations);
router.get("/deleteVacation", vacationsController.deleteVacation);

module.exports = router;
