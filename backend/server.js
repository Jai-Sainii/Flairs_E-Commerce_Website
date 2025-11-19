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


dotenv.config()
const app = express()
app.use(cookieParser());
app.use(express.json())
app.use(cors({
  origin: "http://localhost:5173", // Frontend URL
  credentials: true // Allow cookies to be sent
}))


app.use('/api/auth', authRoutes);
app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/contacts", contactRouter)
app.use("/cart", cartRoutes)

const connectDB = async () => {
    const connect = await mongoose.connect(process.env.MONGO_URI)
    console.log(`Mongodb Connected ${connect.connection.host}`)
}
connectDB();


const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`)
})
