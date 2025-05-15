const express = require("express");
const userRepo = require("../repositories/userRepository");
const router = express.Router();

router.get("/", userRepo.getAllUser);

router.post("/login", userRepo.login);

router.post("/getUser", userRepo.getUserById);

router.post("/transactions", userRepo.getUserTransactions);

router.post("/register", userRepo.addUser);

router.delete("/", userRepo.deleteUser);

router.put("/changePassword", userRepo.changePassword);

module.exports = router;
