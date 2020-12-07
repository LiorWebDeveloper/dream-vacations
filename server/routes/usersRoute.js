const express = require('express');
const router = express.Router();

const usersController = require('../controllers/usersController');

router.post('/insertUser', usersController.insertUser);
router.post('/getUserByMail', usersController.getUserByMail);
//router.get('/deleteUser', usersController.deleteUser);
//router.post('/updateUser', usersController.updateUser);
//router.get('/getAllUsers', usersController.getAllUsers);

module.exports = router;