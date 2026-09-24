import userModel from './user.model.js';

export const findUserByEmailService = async (email) => {
    return await userModel.findOne({ email });
};

export const createUserService = async (userData) => {
    return await userModel.create(userData);
};

export const findUserByIdService = async (id) => {
    return await userModel.findById(id);
};

export const updateUserService = async (id, updateData) => {
    return await userModel.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUserService = async (id) => {
    return await userModel.findByIdAndDelete(id);
};