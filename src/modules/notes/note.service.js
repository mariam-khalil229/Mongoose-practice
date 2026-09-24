import noteModel from './note.model.js';

export const createNoteService = async (noteData) => {
    return await noteModel.create(noteData);
};

export const findNoteByIdService = async (id) => {
    return await noteModel.findById(id);
};

export const updateNoteService = async (id, updateData) => {
    return await noteModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const replaceNoteService = async (id, replacementData) => {
    return await noteModel.findOneAndReplace({ _id: id }, replacementData, { new: true });
};

export const updateAllUserNotesService = async (userId, title) => {
    return await noteModel.updateMany({ userId }, { title });
};

export const deleteNoteService = async (id) => {
    return await noteModel.findByIdAndDelete(id);
};

export const deleteAllUserNotesService = async (userId) => {
    return await noteModel.deleteMany({ userId });
};