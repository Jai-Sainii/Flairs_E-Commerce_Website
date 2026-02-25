import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
});

const Newsletter = mongoose.model("Newsletter", newsletterSchema);

export default Newsletter;
