const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const User = require('../models/userModel');
const Device = require('../models/deviceModel');
const authenticateJWT = require("../middlewares/authMiddleware");


app.use(bodyParser.json());

app.get("/getAllUser",authenticateJWT, async (req,res)=>{
    try {
        const user = await User.findById(req.user.userId);
        if(!user){
            res.status(400).json({
                status:400,
                messsage:"Cannot found User"
            })
        }
        if(user.role !=='admin'){
            res.status(400).json({
                status:400,
                messsage:"You don't have permisson to access"
            })
        }
        const page = parseInt(req.body.page) || 1;
        const limit = parseInt(req.body.limit) || 10;
        const skip = (page - 1) * limit;

        const totalUsers = await User.countDocuments();
        const allUsers = await User.find().skip(skip).limit(limit);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalUsers / limit),
            totalUsers,
            length:allUsers.length,
            data: allUsers,
        });
        
    } catch (error) {
        console.error('Error logging in admin:', err);
        res.status(500).json({status: 500, message: 'Internal server error', error:error.message});
    }
})

app.get("/getAllDevice",authenticateJWT, async (req,res)=>{
    try {
        const user = await User.findById(req.user.userId);
        if(!user){
            res.status(400).json({
                status:400,
                messsage:"Cannot found User"
            })
        }
        if(user.role !=='admin'){
            res.status(400).json({
                status:400,
                messsage:"You don't have permisson to access"
            })
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalDevices = await Device.countDocuments();
        const allDevices = await Device.find().skip(skip).limit(limit);

        res.status(200).json({
            currentPage: page,
            totalPages: Math.ceil(totalDevices / limit),
            totalDevices,
            length:allDevices.length,
            data: allDevices,
        });
        
    } catch (error) {
        console.error('Error logging in admin:', err);
        res.status(500).json({status: 500, message: 'Internal server error', error:error.message});
    }
})

module.exports = app;


