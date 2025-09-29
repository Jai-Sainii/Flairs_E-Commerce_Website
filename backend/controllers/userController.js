import User from "../models/User.js"

export const getAllUser = async (req, res) => {
    const user = await User.find();
    res.send({user})
}

export const singleUser = async (req, res) => {
    const user = await User.findById(req.params.id)
    res.status(200).json({message: "User got", user: user})
}

export const createUser = async (req, res) => {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({message: "User created successfully"})
}

export const updateUser = async (req, res) => {
    const userUpdated = await User.findByIdAndUpdate(
        req.params.id,
        req.body
    )
    res.json({message: "user updated successfully!"})
}

export const deleteUser = async (req, res) => {
    const userUpdated = await User.findOneAndDelete(
        req.params.id,
    )
    res.json({message: "user deleted successfully!"})
}

