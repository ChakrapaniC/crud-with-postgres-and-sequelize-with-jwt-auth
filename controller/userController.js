const { where } = require('sequelize');
const db = require('../postgres');
const user = db.users;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET_KEY

const createUser = async (req, res) => {

    const { username, email, password } = req.body;
    console.log(req.body)
    if (!username || !email || !password) {
        return res.status(400).send({ message: "All fields are required." });
    }

    try {
        const userExists = await user.findOne({
            where: { email : email}
        });
        if (userExists) {
            return res.status(400).send('Email is already associated with an account');
        }
        

        const hashedPassword = await bcrypt.hash(password.toString(), 10);
        console.log(hashedPassword)
        const userObj = {
            username : username,
            email : email,
            password: hashedPassword
        };

        const data = await user.create(userObj);
  
        res.status(201).send({ message: "user create successfully", data });

    } catch (error) {
        res.status(500).send({ error})
    }
}

const userDetails = async (req, res) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userIdFromToken = decodedToken.id; 

        
        const userFromDB = await user.findByPk(userIdFromToken);
        res.status(200).send({userFromDB});

    } catch (error) {
        res.status(500).send({error: error.message})
    }
}

const updateUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userIdFromToken = decodedToken.id; 
        console.log(userIdFromToken);
        
        const userFromDB = await user.findByPk(userIdFromToken); 
        console.log(userFromDB)
       
        if (!userFromDB) {
            return res.status(403).send({ message: "You are not authorized to update this user's data" });
        }

        // Update the user data
        const updateFields = {
            username: username || userFromDB.username,
            email: email || userFromDB.email,
            password: password || userFromDB.password
        };

        await user.update(updateFields, {
            where: { id: userIdFromToken }
        });

        res.status(200).send({ message: `Updated data for: ${userFromDB.username}` });

    } catch (error) {
        res.status(500).send({  error: error.message || "Unknown error occurred" });
    }
};


const deleteUser = async (req, res) => {

    try {
        if (!req.headers.authorization) {
            return res.status(401).send({ message: "You are not authorized" });
        }

        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userIdFromToken = decodedToken.id; 
        // console.log(userIdFromToken);
        
        const userFromDB = await user.findByPk(userIdFromToken); 
        // console.log(userFromDB)
       
        if (!userFromDB) {
            return res.status(403).send({ message: "You are not authorized to delete this user's data" });
        }
        await user.destroy({
            where: { id: userIdFromToken }
        })
        res.status(200).send(`delete data for : ${userFromDB.username}`);

    } catch (error) {
        res.status(500).send({ error: error.message || "Unknown error occurred" });
    }
}


// jwt authentication
const loginUser = async (req, res) => {
   try{
      const {email, password} = req.body;
      const isUser = await user.findOne({where : {email}});
      if(!isUser){
        res.status(404).send({message:'email not found'})
      }
      
      //verify password
      const matchPassword = await bcrypt.compare(password.toString() , isUser.password);
      if (!matchPassword) {
          return res.status(404).send({message:'Incorrect email and password combination'});
      }
      

      //generate token
      const token = jwt.sign({id : isUser.id}, JWT_SECRET , {expiresIn: '1d'})
      res.status(200).send({
        id: isUser.id,
        name: isUser.name,
        email: isUser.email,
        accessToken: token,
    });
      
   }catch (error) {
    return res.status(500).send({error});
}
}

module.exports = { createUser, userDetails, updateUser, deleteUser , loginUser }