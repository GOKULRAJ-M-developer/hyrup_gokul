import jwt from "jsonwebtoken";
import {Student} from '../models/students.js';

const verification = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            req.student = await Student.findById(decoded.id).select("-password");
            next();
        }
        else{
            res.status(401).json({ message: "Unauthorized, no token provided" });
        }
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};
export default verification;