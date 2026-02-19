import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true
        },

        password: {
            type: String,
            required: true
        },

        studentId: {
            type: String,
            required: true,
            unique: true
        },

        course: {
            type: String,
            required: true
        },

        year: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },

        enrollmentDate: {
            type: Date,
            default: Date.now
        },

        gpa: {
            type: Number,
            min: 0,
            max: 10
        },

        phone: String,

        address: {
            door_no: String,
            street: String,
            city: String,
            state: String,
            zip: String
        },

        emergencyContact: {
            name: String,
            phone: String,
            relation: String
        },

        role: {
            type: String,
            enum: ["student", "admin"],
            default: "student"
        },

        isActive: {
            type: Boolean,
            default: true
        },

        refreshToken: {
            type: String
        }

    },
    {
        timestamps: true
    }
);

export const Student = mongoose.model("Student", studentSchema);
