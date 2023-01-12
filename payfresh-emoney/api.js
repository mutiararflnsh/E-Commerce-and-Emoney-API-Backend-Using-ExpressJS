const express =require('express');
const api = express.Router();

const jsonwebtoken = require('jsonwebtoken');
const database = require('./database');
const { hashSync, genSaltSync, compareSync } = require("bcrypt");
 
const userRouter = require('./user');
const adminRouter = require('./admin');

 
api.post('/register', async (req, res, next)=>{
    try{
        const userName = req.body.userName;
        const email = req.body.email;
        const phone = req.body.phone;
        const alamat = req.body.alamat;
        let password = req.body.password;
  
  
              if (!userName || !email || !password || !phone || !alamat) {
                return res.sendStatus(400);
             }
  
             const salt = genSaltSync(10);
             password = hashSync(password, salt);
  
               
  
        const user =  await database.insertUser(userName, email, password, phone, alamat);
         
        const jsontoken = jsonwebtoken.sign({user: user}, "apaya", { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
 
        res.json({token: jsontoken});
 
            //return res.redirect('/mainpage');
  
    } catch(e){    
        console.log(e);
        res.sendStatus(400);
    }
});
 
 api.post('/login', async(req, res, next)=>{
    try{
    const email = req.body.email;
    const password = req.body.password;
    user = await database.getUserByEmail(email);
     
    if(!user){
        return res.json({
            message: "Invalid email or password"
        })
    }
 
    const isValidPassword = compareSync(password, user.password);
    if(isValidPassword){
        user.password = undefined;
        const jsontoken = jsonwebtoken.sign({user: user}, "apaya", { expiresIn: '30m'} );
        res.cookie('token', jsontoken, { httpOnly: true, secure: true, SameSite: 'strict' , expires: new Date(Number(new Date()) + 30*60*1000) }); //we add secure: true, when using https.
 
        res.json({token: jsontoken});
       //return res.redirect('/mainpage') ;
 
    }  else{
        return res.json({
            message: "Invalid email or password"
        });
    } 
 
    } catch(e){
        console.log(e);
    }
}); 

api.get('/allproduct', async (req, res, next)=>{
    try {
        const produk = await database.allproduct();
        res.json({produk: produk});
    } catch(e) {
        console.log(e);
    }
});

api.get('/search', async (req, res, next)=>{
    try {
        const nama_produk = req.body.nama_produk;
        const search = await database.searchproduct(nama_produk);
        
        res.json({"Hasil pencarian": search});
    } catch(e) {
        console.log(e);
    }
});
  
//  Verify Token
async function  verifyToken  (req, res, next){
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
     
    if(token === undefined  ){
         
            return res.json({
                message: "Access Denied! Unauthorized User"
              });
    } else{
 
        jsonwebtoken.verify(token, "apaya", (err, authData)=>{
            if(err){
                res.json({
                    message: "Invalid Token..."
                  });
 
            } else{
                
               
               const role = authData.user.role;
               if(role === "user"){
 
                next();
               } else{
                   return res.json({
                       message: "Access Denied! You are not a User"
                     });
 
               }
            }
        })
    } 
}

async function  verifyTokenAdmin (req, res, next){
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
     
    if(token === undefined  ){
         
            return res.json({
                message: "Access Denied! Unauthorized User"
              });
    } else{
 
        jsonwebtoken.verify(token, "apaya", (err, authData)=>{
            if(err){
                res.json({
                    message: "Invalid Token..."
                  });
 
            } else{
                
               console.log(authData.user.role);
               const role = authData.user.role;
               if(role === "admin"){
 
                next();
               } else{
                   return res.json({
                       message: "Access Denied! you are not an Admin"
                     });
 
               }
            }
        })
    } 
}
  
api.use('/user', verifyToken, userRouter);
api.use('/admin', verifyTokenAdmin, adminRouter);
  
module.exports = api;
