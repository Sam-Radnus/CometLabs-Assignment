import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const test=async(req,res)=>{
    console.log("API is working");
}

export const signup=async(req,res)=>{
    console.log("received signup request")
    try{
        const{name,email,password,role}=req.body;
        const salt=await bcrypt.genSalt();
        console.log(name);
        console.log(email);
        console.log(password);
        console.log(role);
        console.log(process.env.JWT_SECRET);
        const hashedPassword=await bcrypt.hash(password,salt);
        const newUser=new User({
            name,
            email,
            password:hashedPassword,
            role
        })
        
        const result=await newUser.save();
        
        const access_token = jwt.sign({ email: result.email, id: result._id,role:result.role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ email: result.email, access_token });
    

    }
    catch(err){
        res.status(500).json({msg:err.message});
    }
}
export const login=async(req,res)=>{
    console.log("reeived login request")
    try{
        const{email,password}=req.body;
        const user=await User.findOne({email:email});
        if(!user){
            return res.status(404).json({msg:"User not found"});
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({msg:"Invalid credentials"});
        }
        const access_token=jwt.sign({email:user.email,id:user._id,role:user.role},process.env.JWT_SECRET,{ expiresIn: '24h' });
        delete user.password;
        
        res.status(200).json({email,access_token});
    }
    catch(err){
        res.status(500).json({error:err.message});
    }
}