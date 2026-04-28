const jwt = require("jsonwebtoken");

const verifyToken = (req,res)=>{
    try{
     const payload = jwt.verify(req.body.token,process.env.JWT_SECRET)
     res.status(200).json(payload);
    }
    catch(err){
        res.status(401).json({message:"invalid token"})
    }
}

module.exports = verifyToken