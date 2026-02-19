import { Student } from '../models/students.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/generateTokens.js';

const registerStudent = async (req, res) => {
    try {
        const { name, email, password, studentId, course, year } = req.body;

        if (!name || !email || !password || !studentId || !course || !year) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existmail = await Student.findOne({ email });
        if (existmail) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const existuser = await Student.findOne({ studentId });
        if (existuser) {
            return res.status(400).json({ message: "Student ID already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newStudent = await Student.create({
            name,
            email,
            password: hashedPassword,
            studentId,
            course,
            year
        });

        const accesstoken = generateAccessToken(
            newStudent._id,
            newStudent.email,
            newStudent.role
        );
        const refreshToken = generateRefreshToken(newStudent._id);
        newStudent.refreshToken = refreshToken;
        await newStudent.save();

        
        return res.status(201).json({
            message: "Student registered successfully",
            accesstoken,
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const usermail = await Student.findOne({ email });
        if (!usermail) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const userpass = await bcrypt.compare(password, usermail.password);
        if (!userpass) {
            return res.status(401).json({ message: "invalid credentials" });
        }

        const accesstoken = generateAccessToken(
            usermail._id,
            usermail.email,
            usermail.role
        );

        const refreshToken = generateRefreshToken(usermail._id);
        usermail.refreshToken = refreshToken;
        await usermail.save();

        return res.status(200).json({
            message: "Login successful",
            accesstoken,
            refreshToken
        });

    } catch (error) {
        return res.status(500).json({ message: "Server Error", error: error.message });
    }
};

const refreshAccessToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        const user = await Student.findById(decoded.id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        const newAccessToken = generateAccessToken(
            user._id,
            user.email,
            user.role
        );

        return res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
        return res.status(401).json({ message: "Invalid refresh token", error: error.message });
    }
};

const logoutStudent = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }

        const student = await Student.findOne({ refreshToken });

        if (!student) {
            return res.status(400).json({ message: "Invalid refresh token" });
        }

        student.refreshToken = null;
        await student.save();

        return res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        return res.status(500).json({
            message: "Server Error",
            error: error.message
        });
    }
};

export { registerStudent, loginStudent, refreshAccessToken, logoutStudent };