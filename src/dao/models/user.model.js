import mongoose from "mongoose";

const schema = new mongoose.Schema({
    first_name: {
        type: String, 
        required: true
    },
    last_name: {
        type: String, 
        required: true
    }, 
    email: {
        type: String, 
        required: true,
        unique: true, 
        index: true
    },
    cart_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts', 
        required: true 
    },    
    password: {
        type: String, 
        required: true
    }, 
    age: {
        type: Number, 
        required: true
    },
    role: {
        type: String, 
        enum: ["admin", "usuario"], 
        default: "usuario"
    }
})

const UserModel = mongoose.model("users", schema); 

export default UserModel; 
