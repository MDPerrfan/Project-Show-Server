import express from "express";
import { body, validationResult } from "express-validator";
import projectModel from "../models/projectModel.js";
import userAuth from "../middleware/userAuth.js";

const projectRouter = express.Router();

// Validation rules
const validateProject = [
    body("id").notEmpty().withMessage("Project ID is required").trim(),
    body("name").notEmpty().withMessage("Student name is required").trim(),
    body("batch").notEmpty().withMessage("Batch is required").trim(),
    body("title").notEmpty().withMessage("Project title is required").trim(),
    body("supervisor").notEmpty().withMessage("Supervisor name is required").trim(),
    body("year")
    .isInt({ min: 2000, max: new Date().getFullYear() })
    .withMessage("Year must be a valid number between 2000 and current year"),
    body("link").optional().isURL().withMessage("Invalid URL format"),
    body("keywords")
    .isArray({ min: 1 })
    .withMessage("Keywords must be an array with at least one keyword"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Create a new project
projectRouter.post("/create", validateProject, handleValidationErrors, async(req, res) => {
    try {
        const project = new projectModel(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all projects
projectRouter.get("/get", async(req, res) => {
    try {
        const projects = await projectModel.find();
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get a project by ID
projectRouter.get("/getbyid/:id", async(req, res) => {
    try {
        const project = await projectModel.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a project
projectRouter.put("/update/:id", userAuth, validateProject, handleValidationErrors, async(req, res) => {
    try {
        const updatedProject = await projectModel.findOneAndUpdate({ id: req.params.id },
            req.body, { new: true }
        );
        if (!updatedProject)
            return res.status(404).json({ message: "Project not found" });
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete a project
projectRouter.delete("/delete/:id", userAuth, async(req, res) => {
    try {
        const deletedProject = await projectModel.findOneAndDelete({ id: req.params.id });
        if (!deletedProject)
            return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default projectRouter;