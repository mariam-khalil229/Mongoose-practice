import * as userService from './user.service.js';

// Q1: Signup
export const signupUser = async (req, res) => {
    try {
        const { email } = req.body;
        const existingUser = await userService.findUserByEmailService(email);
        
        if (existingUser) {
            return res.status(409).json({ message: "Email already exists." });
        }
        
        await userService.createUserService(req.body);
        res.status(201).json({ message: "User added successfully." });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q2: Create an API for authenticating users (Login)
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userService.findUserByEmailService(email);
        
        if (!user || user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        
        res.status(200).json({ message: "Success", userId: user._id });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q3: Update logged-in user information (Except Password)
export const updateLoggedInUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, password, ...updateData } = req.body;
        
        const user = await userService.findUserByIdService(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email && email !== user.email) {
            const emailExists = await userService.findUserByEmailService(email);
            if (emailExists) {
                return res.status(409).json({ message: "Email already exists" });
            }
            updateData.email = email;
        }

        const updatedUser = await userService.updateUserService(id, updateData);
        res.status(200).json({ message: "User updated", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q4: Delete logged-in user
export const deleteLoggedInUser = async (req, res) => {
    try {
        const { id } = req.query; 
        const deletedUser = await userService.deleteUserService(id);
        
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json({ message: "user deleted" });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Q5: Get logged-in user data by his ID
export const getLoggedInUser = async (req, res) => {
    try {
        const { id } = req.query; 
        const user = await userService.findUserByIdService(id);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};