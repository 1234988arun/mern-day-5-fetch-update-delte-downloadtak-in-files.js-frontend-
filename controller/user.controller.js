const userModel = require("../model/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async(req,res)=>{
    try{
    // console.log(req.body);
    const user  = await userModel.create(req.body);
    res.status(201).json({message:"signup successfully"});
    }
    catch(err){
    res.status(500).json({message:err.message})
    }
}


// for login we have already model make endpoint  , then here logic 

const login = async(req,res)=>{
    try{
        const {email,password} = req.body
        const user = await userModel.findOne({email:email})
        // console.log(user);
        if(!user){
           return res.status(404).json({message:"user email doesn't exist"})
        }

        const isLogin = bcrypt.compareSync(password,user.password)
        // console.log(isLogin);
        if(!isLogin){return    res.status(401).json({message:"password is incorrect"})}
    
        // console.log(user);
        const payload ={
            fullname:user.fullname,
            mobile:user.mobile,
            email:user.email
        }
    //   const token = jwt.sign(data,secretkey,expiresin)    
    const token = jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:'7d'})
    // console.log(token);
        
        res.status(200).json({message:"login successfully",token:token});

    }
    catch(err){
        res.status(500).json({message:err.message})
    }
}


module.exports = {signup,login}