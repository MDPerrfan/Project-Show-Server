import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
        id: { type: String, required: true },
        name: { type: String, required: true },
        batch: { type: String, required: true },
        title: { type: String, required: true },
        supervisor: { type: String, required: true },
        year: { type: String, required: true },
        link: { type: String, required: false }, // Optional field
        keywords: { type: [String], required: true }, // Array of strings
    }, { timestamps: true } // Automatically adds createdAt & updatedAt
);

const projectModel = mongoose.model("project", projectSchema);

export default projectModel;