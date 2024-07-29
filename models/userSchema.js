import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, "Name Required!"],
    },
    email: {
        type: String,
        required: [true, "Email Required!"],
    },
    phone: {
        type: Number,
        required: [true, "Number Required!"],
    },
    aboutMe: {
        type: String,
        required: [true, "About me field is Required!"],
    },
    password: {
        type: String,
        required: [true, "Password is Required!"],
        minLength: [8, "Password must contain atleast 8 characters!"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    resume: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    portfolioURL: {
        type: String,
        required: [true, "Portfolio URL is required!"],
    },
    githubURL: String,
    instagramURL: String,
    linkedInURL: String,
    githubURL: String,
    facebookURL: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {timestamps: true});

// for hashing password
userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }
    //bcrypt is used to convert the password into hash value and it is recommended to use value of 10 for bcrypt because it if we use 8 then our password is weak and if we use 12 then our password encrpyted so much strong which caused data to load slowly.
    this.password = await bcrypt.hash(this.password, 10);
});

// for comparing password
userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// generating json web tokens
userSchema.methods.generateJsonWebToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRES
    });
};

userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    return resetToken;
}


export const User = mongoose.model("User", userSchema);