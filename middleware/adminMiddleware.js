const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Admin = require("../models/adminModel");

const adminAuth = asyncHandler(async (req, res, next) => {
    let token;
    
    // Check if the authorization header exists and starts with Bearer
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
        token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = await Admin.findById(decoded.id).select("-admin_password");
        next();
        } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
        }
    }
    
    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }
    });

module.exports = adminAuth;