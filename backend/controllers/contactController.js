import Contact from "../models/Contact.js"

export const createContactInfo = async (req, res) => {
    const contact = new Contact(req.body)
    await contact.save()
    res.status(201).json({message: "Contact Info created successfully"})
}
