const {Schema, model} = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new Schema({
    fullname:{
        type:String,
        trim:true,
        lowercase:true,
        required:true
    },
    mobile:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        match: [/^[a-zA-Z0-9._%+-]{3,}@gmail\.com$/, "Enter a valid Gmail (min 3 chars before @)"],
        required:true,
    },
    password:{
        type:String,
        required:true,
        trim:true
    }
},{timestamps:true})

// validation before creating the user for email and mobile

// for mobile
userSchema.pre("save", async function(next) {
    // console.log(this.mobile)// ye user create hone se phle chalega or bina next ke save ni hoga
    const count  = await model("User").countDocuments({mobile:this.mobile})
    // console.log(count);
    if(count>0){
        return next(new Error("mobile already exist"))
    }
       next();
});

// for email
userSchema.pre("save", async function(next) {
    const count  = await model("User").countDocuments({email:this.email})
       if(count>0){
           return next(new Error("email already exist"))
       }
       next();
});

// for password bcrypt so other can't see
    
userSchema.pre("save", async function(next) {
    const EncryptedPssword = await bcrypt.hash(this.password.toString(),12);
    // console.log(EncryptedPssword);
    this.password = EncryptedPssword 
    next()
});








const userModel = model("User", userSchema)
module.exports = userModel