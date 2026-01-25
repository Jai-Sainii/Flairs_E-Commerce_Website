import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser";

import userRouter from "./routes/userRoutes.js"
import authRoutes from "./routes/authRoutes.js"
import productRouter from "./routes/productRoutes.js"
import contactRouter from "./routes/contactRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"


dotenv.config()
const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true 
}))
// app.use(cors())


app.use('/api/auth', authRoutes);
app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/contacts", contactRouter)
app.use("/cart", cartRoutes)
app.use("/orders", orderRoutes)

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Mongodb Connected ${connect.connection.host}`)
}
connectDB();


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})
