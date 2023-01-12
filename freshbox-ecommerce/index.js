const express =require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
 
const api = require('./api');
    
const app = express();
    
const PORT = process.env.PORT || 3000;
    
app.use(bodyParser.json());
app.use(cors());
  
app.use('/api',api)
    
app.listen(PORT, ()=>{
    console.log(`server is listening  on ${PORT}`);
});
    
module.exports = app;