import mongoose from 'mongoose';
import * as noteService from './note.service.js';
import noteModel from './note.model.js';

// Q1: Create a Single Note
export const createNote = async (req, res) => {
    try {
        const { loggedInUserId } = req.query; 
        const note = await noteService.createNoteService({ ...req.body, userId: loggedInUserId });
        res.status(201).json({ message: "Note created", note });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q2: Update a single Note by its id and return the updated note
export const updateNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { loggedInUserId } = req.query;

        const note = await noteService.findNoteByIdService(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== loggedInUserId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const updatedNote = await noteService.updateNoteService(noteId, req.body);
        res.status(200).json({ message: "updated", note: updatedNote });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q3: Replace the entire note document with the new data provided in the request body
export const replaceNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { loggedInUserId } = req.query;

        const note = await noteService.findNoteByIdService(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== loggedInUserId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const replacedNote = await noteService.replaceNoteService(noteId, { ...req.body, userId: loggedInUserId });
        res.status(200).json({ message: "updated", note: replacedNote });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q4 & Q5: Updates the title of all notes created by a logged-in user
export const updateAllMyNotes = async (req, res) => {
    try {
        const { loggedInUserId } = req.query;
        const { title } = req.body;

        const result = await noteService.updateAllUserNotesService(loggedInUserId, title);
        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "No note found" });
        }

        res.status(200).json({ message: "All notes updated" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q6: Delete a single Note by its id and return the deleted note
export const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const { loggedInUserId } = req.query;

        const note = await noteService.findNoteByIdService(noteId);
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== loggedInUserId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        const deletedNote = await noteService.deleteNoteService(noteId);
        res.status(200).json({ message: "delete", note: deletedNote });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q7: Retrieve a paginated list of notes for the logged-in user, sorted by createdAt in descending order
export const paginateAndSortNotes = async (req, res) => {
    try {
        const { loggedInUserId, page = 1, limit = 5 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const notes = await noteModel.find({ userId: loggedInUserId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q8: Get a note by its id
export const getNoteById = async (req, res) => {
    try {
        const { id } = req.params;
        const { loggedInUserId } = req.query;

        const note = await noteService.findNoteByIdService(id);
        if (!note) return res.status(404).json({ message: "Note not found" });
        if (note.userId.toString() !== loggedInUserId) {
            return res.status(403).json({ message: "You are not the owner" });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q9: Get a note for logged-in user by its content
export const getNoteByContent = async (req, res) => {
    try {
        const { loggedInUserId, content } = req.query;

        const note = await noteModel.findOne({ userId: loggedInUserId, content });
        if (!note) return res.status(404).json({ message: "No note found" });

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q10: Retrieves all notes for the logged-in user with user information
export const getNotesWithUserPopulate = async (req, res) => {
    try {
        const { loggedInUserId } = req.query;

        const notes = await noteModel.find({ userId: loggedInUserId })
            .select('title userId createdAt')
            .populate('userId', 'email -_id');

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q11: Using aggregation, retrieves all notes for the logged-in user with user information and allow searching notes by the title
export const getNotesAggregate = async (req, res) => {
    try {
        const { loggedInUserId, title } = req.query;

        const matchStage = { userId: new mongoose.Types.ObjectId(loggedInUserId) };
        if (title) {
            matchStage.title = { $regex: title, $options: 'i' };
        }

        const notes = await noteModel.aggregate([
            { $match: matchStage },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'user'
                }
            },
            { $unwind: '$user' },
            {
                $project: {
                    title: 1,
                    userId: 1,
                    createdAt: 1,
                    "user.name": 1,
                    "user.email": 1
                }
            }
        ]);

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q12: Delete all notes for the logged-in user
export const deleteAllMyNotes = async (req, res) => {
    try {
        const { loggedInUserId } = req.query;
        await noteService.deleteAllUserNotesService(loggedInUserId);
        res.status(200).json({ message: "Deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};