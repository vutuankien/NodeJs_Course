const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const studentSchema = new Schema({
    studentName: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
})

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;