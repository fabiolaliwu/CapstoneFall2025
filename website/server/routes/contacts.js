import express from 'express';
import {
    createContactForm,
    getAllContactForms,
    getContactFormById,
    updateContactForm,
    deleteContactForm
} from '../controllers/contactControllers.js';

const router = express.Router();

// POST: Create a new contact form
router.post('/', createContactForm);

// GET: Get all contact forms
router.get('/', getAllContactForms);

// GET: Get a single contact form by Mongodb ID
router.get('/:id', getContactFormById);

// UPDATE: Update a contact form by Mongodb ID. 
router.put('/:id', updateContactForm);

// DELETE: Delete a contact form by Mongodb ID
router.delete('/:id', deleteContactForm);

export default router;

/**
 * The backend worklow of contact form is reference by 
https://javascript.plainenglish.io/how-i-integrated-a-mongodb-database-into-my-react-js-project-6cdc331923d3
to handle formData submission to the mongodb database
 */