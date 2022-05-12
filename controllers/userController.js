import User from "../models/userModel.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from "../models/userModel.js";

export const registerUser = async (req, res) => {
    const {email, password, firstName, lastName} = req.body;
    try {
        const userExists =  await User.findOne({email});
        if(userExists) {
            return res.status(400).json({message: 'User already exists'});
        };

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await User.create({
            name: `${firstName} ${lastName}`,
            email,
            password: hashedPassword
        });

        const token = generateToken(newUser._id)
        res.status(201).json({ newUser, token })
    } 
    catch (error) {
        res.status(500).json({message: 'Something went wrong'});
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;
    const User = await userModel.findOne({email});
    if(User && (await bcrypt.compare(password, User.password))) {
        res.status(200).json({result: User, token: generateToken(User._id)})
    }
    else {
        res.status(400).json({message: 'Invalid Credentials'});
    }
};

export const googleSignIn = async (req, res) => {
    const {email, name, token, googleId} = req.body;
    try {
        const User = await userModel.findOne({email});
        if(User) {
            const result = {_id: User._id.toString(), email, name};
            return res.status(200).json({result, token});
        };
        const result = await userModel.create({
            email, 
            name, 
            googleId
        });
        res.status(200).json({result, token});

    } catch (error) {
        res.status(500).json({message: 'something went wrong'});
    }
}

//Generate Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.SECRET, {expiresIn: '30d'})
};
