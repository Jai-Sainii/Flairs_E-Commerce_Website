import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"

import userRouter from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import productRouter from "./routes/productRoutes.js"
import contactRouter from "./routes/contactRoutes.js"


dotenv.config()
const app = express()
app.use(express.json())
app.use(cors())


app.use('/api/auth', authRoutes);
app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/contacts", contactRouter)

const connectDB = async () => {
    const connect = await mongoose.connect("mongodb://localhost:27017/test_01")
    console.log(`Mongodb Connected ${connect.connection.host}`)
}

connectDB();

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})
