import express from "express";

import {
    getAllUsers,
    createNewUser,
    makeAdmin,
    deleteUser,
    loginUser,
} from "../controllers/userControllers.js";

const router = express.Router();

// GET all users
router.get("/", getAllUsers);

// POST new user
router.post("/signup", createNewUser);

// PUT make user an admin
router.put("/:id", makeAdmin);

// DELETE user by id
router.delete("/:id", deleteUser);

// POST login user
router.post("/login", loginUser);

export default router;