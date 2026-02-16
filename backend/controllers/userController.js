import User from "../models/User.js"

export const singleUser = async (req, res) => {
    const user = await User.findById(req.user._id)
    res.status(200).json({message: "User got", user: user})
}


