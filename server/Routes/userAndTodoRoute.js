const express = require("express");
const { registerUser, loginUser } = require("../Controller/userController");
const errorHandler = require("../Middleware/errorHandler");


const router = express.Router();

router.post("/register", registerUser); //done

router.post("/login", loginUser); //done

router.use(errorHandler);

module.exports = router;
