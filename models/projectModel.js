import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
    students: [studentSchema],
    batch: { type: String, required: true },
    title: { type: String, required: true },
    supervisor: { type: String, required: true },
    year: { type: String, required: true },
    link: { type: String, required: false },
    keywords: { type: [String], required: true }
}, { timestamps: true });

// Add validation for at least one student
projectSchema.pre('save', function(next) {
    if (this.students.length === 0) {
        next(new Error('At least one student is required'));
    }
    if (this.students.length > 5) {
        next(new Error('Maximum 5 students allowed'));
    }
    next();
});

// Add validation for unique student IDs within a project
projectSchema.path('students').validate(function(students) {
    const ids = students.map(s => s.id);
    const uniqueIds = new Set(ids);
    return ids.length === uniqueIds.size;
}, 'Duplicate student IDs are not allowed');

const projectModel = mongoose.model("project", projectSchema);

export default projectModel;