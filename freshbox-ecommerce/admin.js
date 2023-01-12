const express = require('express');
const database = require('./database');
const adminrouter = express.Router();

const {
    hashSync,
    genSaltSync,
    compareSync
} = require("bcrypt");

adminrouter.post('/topup/:id', async (req, res, next) => {
    try {
        const amount = req.body.amount;
        const userId = req.params.id

        if (!amount) {
            return res.sendStatus(400);
        }

        const balance = await database.topup(amount, userId);
        //const updated = await database.updateHistory("topup", amount, userId);
        //res.json({
        //    balance: balance
        //});
        res.json({
            message: "Top Up berhasil"
        });


    } catch (e) {
        console.log(e);
        res.sendStatus(400);
    }
});

adminrouter.get('/', async (req, res, next)=>{
    try {
        const users = await database.allUser();
        res.json({users: users});
    } catch(e) {
        console.log(e);
    }
});

adminrouter.delete('/:id',  async (req, res, next)=>{
    try{
        const userId = req.params.id
        const user =  await database.deleteUser(userId);
        return res.sendStatus(204);
     
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});

adminrouter.get('/:userId',  (req, res, next)=>{
    res.status(200).json({user: req.user});
});

adminrouter.param('userId', async (req, res, next, userId)=> {
    try{
        const user = await database.getOne("User", userId);
        req.user = user;
        next();
    } catch(e) {
        console.log(e);
        res.sendStatus(404);
    }
});

module.exports = adminrouter;