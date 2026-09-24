import { Router } from 'express';
import * as noteController from './note.controller.js';

const router = Router();

router.patch('/all', noteController.updateAllMyNotes); // Q4 & Q5
router.get('/paginate-sort', noteController.paginateAndSortNotes); // Q7
router.get('/note-by-content', noteController.getNoteByContent); // Q9
router.get('/note-with-user', noteController.getNotesWithUserPopulate); // Q10
router.get('/aggregate', noteController.getNotesAggregate); // Q11
router.put('/replace/:noteId', noteController.replaceNote); // Q3

router.post('/', noteController.createNote); // Q1
router.delete('/', noteController.deleteAllMyNotes); // Q12
router.patch('/:noteId', noteController.updateNote); // Q2
router.delete('/:noteId', noteController.deleteNote); // Q6
router.get('/:id', noteController.getNoteById); // Q8

export default router;