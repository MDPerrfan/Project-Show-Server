import mongoose from "mongoose";
// Define the student schema without the _id field
const studentSchema = new mongoose.Schema({
    sid: { type: String, required: true },  // Student ID for display
    name: { type: String, required: true },  // Student Name
}, { _id: false });
const projectSchema = new mongoose.Schema({
    students: { type: [studentSchema], required: true },  // Array of students
    batch: { type: String, required: true },
    title: { type: String, required: true },
    supervisor: { type: String, required: true },
    year: { type: String, required: true },
    link: { type: String, required: false },
    keywords: { type: [String], required: true }
}, { 
    timestamps: true,
    // Ensure no automatic indexes are created
    autoIndex: false
});

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
    const sids = students.map(s => s.sid);
    const uniqueSids = new Set(sids);
    return sids.length === uniqueSids.size;
}, 'Duplicate student IDs are not allowed');

// Drop any existing indexes before creating the model
const projectModel = mongoose.model("project", projectSchema);
projectModel.collection.dropIndexes().catch(err => {
    // Ignore error if indexes don't exist
    if (err.code !== 26) {
        console.error('Error dropping indexes:', err);
    }
});

export default projectModel;