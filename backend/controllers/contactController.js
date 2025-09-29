import Contact from "../models/Contact.js"

export const getAllContactInfo = async (req, res) => {
    const contact = await Contact.find()
    res.send({contact})
}

export const createContactInfo = async (req, res) => {
    const contact = new Contact(req.body)
    await contact.save()
    res.status(201).json({message: "Contact Info created successfully"})
}

export const getSingleContactInfo = async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    res.status(200).json({message: "Contact Info got", contact: contact})
}