import Product from "../models/Product.js"

export const getAllProducts = async (req, res) => {
    const product = await Product.find()
    res.send({product})
}

export const createProduct = async (req, res) => {
    const product = new Product(req.body)
    await product.save()
    res.status(201).json({message: "Product created successfully"})
}

export const getSingleProduct = async (req, res) => {
    const product = await Product.findById(req.params.id)
    res.status(200).json({message: "Product got", product: product})
}


