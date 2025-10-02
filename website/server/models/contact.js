import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        maxLength: 50
    },
    email: {
        type: String,
        required: true,
        maxLength: 100
    },
    subject: {
        type: String,
        required: true,
        maxLength: 100
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['Issue', 'Feedback', 'Other'],
        default: ''
    },
    fixed: {
        type: Boolean,
        default: false
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Contact', contactSchema)