import mongoose from "mongoose";

const UserSchema=new mongoose.Schema(
    {
        name:{ 
            type:String,
            required:true,
            min:5,
            max:20,
           },
        email:{
            type:String,
            required:true, 
            unique:true,
            min:10,
            max:50,
        },
        password:{
            type:String,
            required:true,
            min:5,
        },
        role:{
            type:String,
            required:true,
        }
},
{timestamps:true}
);

const User=mongoose.model("User",UserSchema);
export default User;