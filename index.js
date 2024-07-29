const express = require('express');
const db = require('./postgres');
const app = express();
const bodyParser = require('body-parser');
const { createUser, findAllUsers, updateUser, deleteUser, loginUser, userDetails } = require('./controller/userController');
const { verifyTokenMiddleware } = require('./auth/tokenAuth');
app.use(bodyParser.json())

const createTable = async() => {
   try{
     await db.sequelize.sync();
     console.log('All models were synchronized successfully.');
   }catch(err) {
    console.log("error occured " ,err)
   }
}
createTable();

//routes

app.post('/user/new', (req , res)=> {
    createUser(req,res)
})

app.get('/user/details',  verifyTokenMiddleware,(req, res)=> {
    userDetails(req, res);
})

app.put('/user/update', verifyTokenMiddleware ,(req,res)=> {
    updateUser(req,res);
})

app.delete('/user/delete/',verifyTokenMiddleware ,(req,res)=> {
    deleteUser(req,res)
})

app.post('/user/login', (req ,res)=> {
    loginUser(req, res)
})



const port = 5000;
app.listen(port , ()=> {
    console.log(`server is running at port ${port}`);
})