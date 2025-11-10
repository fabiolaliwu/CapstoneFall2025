import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// create a new user
export const createNewUser = async (req, res) => { // req is request from frontend, res is response from backend
    
    const { username, password } = req.body;
    // console.log("creating user:", username);

    try {

        // first check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists" });
        }

        // hash password with bycrypt before storing
        // console.log('About to hash password'); // Debug log
        const hashedPassword = await bcrypt.hash(password, 10) // await because of async
        // console.log('Password hashed successfully'); // Debug log


        // create new user w hashed pw
        const newUser = await User.create({
            username,
            password: hashedPassword,
            role: 'user' // default role is user
        });

        // create a JWT w/ user id 
        const token = jwt.sign( // function that creates the tokem
            { 
                id: newUser._id,
                role: newUser.role
            }, // mongoDb's id
            process.env.JWT_SECRET, // secret key to "sign token" from .env file
            { expiresIn: "1d" } // token expires in 1 day
        );

        const { password: pw, ...userWithoutPassword } = newUser._doc; 
        //send back user info without password

        res.status(200).json({ user: newUser, token });  // status 200 means its ok so send back user and token to frontend as a json with the res object
    } catch (error) {
        console.error("USER CREATE ERROR:", error); 
        res.status(400).json({ error: error.message }); // status 400 means bad request so send back error message as json with res object
    } 
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, '-password'); //do not return password field
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        //  find user by ID and delete
        const deletedUser = await User.findByIdAndDelete(req.params.id); 

        if (!deletedUser) return res.status(404).json({ error: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
        // console.log("DELETE USER SUCCESS:", deletedUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const makeAdmin = async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, // mongo ID
            { role: 'admin' },
            { new: true }
        );
        // console.log("MAKE ADMIN SUCCESS:", updatedUser);
        if (!updatedUser) return res.status(404).json({ error: "User not found" });
        const { password: pw, ...userWithoutPassword } = updatedUser._doc;
        res.status(200).json(updatedUser);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};

export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: "Invalid username or password" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid username or password" });

        // make JWT for no need to login again for 1 day
        const token = jwt.sign(
            { 
                id: user._id, 
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        const { password: pw, ...userWithoutPassword } = user._doc; // collects password into pw and rest into userWithoutPassword
        // console.log("LOGIN SUCCESS:", user);

        res.status(200).json({ user: userWithoutPassword, token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// get user info by MongoDB _id
export const getUserById = async (req, res) => {
    try {
        // do not return password field
        const user = await User.findById(req.params.id, '-password');
        
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// update user avatar
export const updateAvatar = async (req, res) => {
    const { avatar } = req.body; 
    if(!avatar){
        return res.status(400).json({ error: "Avatar is required" });
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { avatar: req.body.avatar },
            { new: true}
        );
        if(!updatedUser){
            return  res.status(404).json({ error: "User not found" });
        }
        res.status(200).json(updatedUser);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
}