const { Sequelize , DataTypes } = require('sequelize');
require('dotenv').config();

 

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'postgres'
});


const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}
connection()

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize ;

db.users = require('./model/userModel')(sequelize , DataTypes);



module.exports = db ; 