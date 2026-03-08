import Product from "../models/Product.js"

export const getAllProducts = async (req, res) => {
    const product = await Product.find()
    res.send({product})
}

export const getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.status(200).json({message: "Product got", product: product})
}


