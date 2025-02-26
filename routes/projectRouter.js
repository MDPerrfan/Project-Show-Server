import express from "express";
import projectModel from "../models/projectModel.js";
import userAuth from "../middleware/userAuth.js";
const projectRouter = express.Router();

projectRouter.post("/create", async(req, res) => {
    try {
        const { id } = req.body;
        // Check if the Student ID already exists
        const existingStudent = await projectModel.findOne({ id });
        if (existingStudent) {
            return res.status(400).json({ success: false, message: 'This Student ID already exists.' });
        }
        const project = new projectModel(req.body);
        await project.save();

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
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
projectRouter.put("/update/:id", userAuth, async(req, res) => {
    try {
        const updatedProject = await projectModel.findOneAndUpdate({ _id: req.params.id },
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
        const deletedProject = await projectModel.findOneAndDelete({ _id: req.params.id });
        if (!deletedProject)
            return res.status(404).json({ message: "Project not found" });
        res.json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default projectRouter;