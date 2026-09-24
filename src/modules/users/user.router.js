import { Router } from 'express';
import * as userController from './user.controller.js';

const router = Router();

router.post('/signup', userController.signupUser); // Q1: Signup
router.post('/login', userController.loginUser); // Q2: Login
router.patch('/:id', userController.updateLoggedInUser); // Q3: Update logged-in user
router.delete('/', userController.deleteLoggedInUser); // Q4: Delete logged-in user
router.get('/', userController.getLoggedInUser); // Q5: Get logged-in user

export default router;