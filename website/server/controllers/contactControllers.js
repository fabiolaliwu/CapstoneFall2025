import Contact from '../models/Contact.js';

// POST: Create a new contact form
export const createContactForm = async (req, res) => {
    const { fullName, email, subject, type, message } = req.body;
    try {
        const newContact = await Contact.create({
            fullName,
            email,
            subject,
            type,
            message,
        });
        res.status(200).json(newContact);
    } catch (error) {
        console.error("CONTACT CREATE ERROR:", error);
        res.status(400).json({ error: error.message });
    } 
};

// GET: Get all contact forms
export const getAllContactForms = async (req, res) => {
    try {
        const allContacts = await Contact.find({});
        res.status(200).json(allContacts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET: Get a single contact form by Mongodb ID
export const getContactFormById = async (req, res) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findById(id);
        if (!contact) return res.status(404).json({ error: "Contact form not found" });
        res.status(200).json(contact);
    } catch (err) {
        res.status(400).json({ error: "Invalid contact form ID"});
    }
};

// UPDATE: Update a contact form by Mongodb ID. Mark it as fixed or not fixed
export const updateContactForm = async (req, res) => {
    try {
        const updatedContact = await Contact.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!updatedContact) return res.status(404).json({ error: "Contact form not found" });
        res.status(200).json(updatedContact);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE: Delete a contact form by Mongodb ID
export const deleteContactForm = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);
        if (!contact) return res.status(404).json({ error: "Contact form not found" });
        res.status(200).json({ message: "Contact form deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};