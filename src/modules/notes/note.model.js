import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
    // Q1 (Must Implemented): Add a custom validator to the "title" field that ensure the title is not entirely uppercase
    title: { 
        type: String, 
        required: true,
        validate: {
            validator: function(value) {
                return value !== value.toUpperCase();
            },
            message: "Title cannot be entirely uppercase"
        }
    },
    content: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const noteModel = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default noteModel;