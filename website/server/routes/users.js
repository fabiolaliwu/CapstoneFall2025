import express from "express";

import {
    getAllUsers,
    createNewUser,
    makeAdmin,
    deleteUser,
    loginUser,
    getUserById,
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

// GET user by id
router.get("/:id", getUserById);
export default router;