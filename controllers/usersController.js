const User = require("../models/User");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const Product = require("../models/Product");

// @desc Create new user
// @route POST /users
// @access Public
const register = asyncHandler(async (req, res) => {
    const { name, username, password, email, mobileno } = req.body;

    if (!name || !username || !password || !email || !mobileno) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate_username = await User.findOne({ username }).lean().exec();
    const duplicate_email = await User.findOne({ email }).lean().exec();

    if (duplicate_username || duplicate_email) {
        return res.status(409).json({ message: "Duplicate username or email" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        username,
        password: hashedPwd,
        email,
        mobileno,
    });

    if (user) {
        req.session.userId = user._id; // Corrected 'session' to 'req.session'
        res.status(201).json({
            message: `New user ${username} created and its session id ${req.session.userId}`,
            newUser: user,
        });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// @desc Login user
// @route POST /users
// @access Public
const login = asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    if (!password || !(username || email)) {
        return res.status(400).json({ message: "All fields are required" });
    }

    let user;

    if (username) {
        user = await User.findOne({ username }).lean().exec();
    } else {
        user = await User.findOne({ email }).lean().exec();
    }

    if (!user) {
        return res.status(409).json({ message: "User not found" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
        // Changed 'hash' to 'compare'
        return res.status(409).json({ message: "Wrong password" });
    }

    if (user) {
        req.session.userId = user._id;
        res.status(201).json({
            message: "Login successful",
            user: user,
            sessionid: req.session.userId,
        });
    } else {
        res.status(400).json({ message: "Invalid user data received" });
    }
});

// @desc Update user profile
// @route PUT /users
// @access Private
const updateProfile = asyncHandler(async (req, res) => {
    const { id, name, username, password, email, mobileno } = req.body;

    const user = await User.findOne({ _id: id }).lean().exec();

    if (!user || req.session.userId !== user._id) {
        return res.status(400).json({ message: "User not found or unauthorized" });
    }

    if (!name || !username || !password || !email || !mobileno) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const hashedPwd = await bcrypt.hash(password, 10);

    const duplicate_username = await User.findOne({ username }).lean().exec();
    const duplicate_email = await User.findOne({ email }).lean().exec();

    if (duplicate_username || duplicate_email) {
        return res.status(409).json({ message: "Duplicate username or email" });
    }

    const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, username, password: hashedPwd, email, mobileno },
        { new: true },
    );

    if (!updatedUser) {
        res.status(400).json({
            message: "Invalid user data received",
            updatedUser: updatedUser,
        });
    }

    res.status(201).json({
        message: `User profile updated for user with id ${id}`,
    });
});



// @desc Logout user
// @route GET /users/logout
// @access Private
const logout = asyncHandler(async (req, res) => {
    console.log(req.session);
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ message: "Error logging out" });
        } else {
            console.log(req.session);
            res.status(200).json({ sessionid: req.session,  message: "logout successfull" });
        }
    });
});

module.exports = {
    login,
    register,
    logout,
    updateProfile,
};
