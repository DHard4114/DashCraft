const express = require("express");
const userRepo = require("../repositories/userRepository");
const router = express.Router();

// get all user
router.get("/", userRepo.getAllUser);

// get user by credential
router.post("/login", userRepo.login);

// get user by id
router.get("/:userId", userRepo.getUserById);

// get user transactions
router.get("/transactions/:userId", userRepo.getUserTransactions);

// add user
router.post("/addUser", userRepo.addUser);

// Delete a user by ID
router.delete("/:userId", userRepo.deleteUser);

// Change password
router.put("/changePassword/:userId", userRepo.changePassword);

module.exports = router;
