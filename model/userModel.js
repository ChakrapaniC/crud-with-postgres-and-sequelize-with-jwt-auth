
module.exports = (sequelize, DataTypes) => {
    const users = sequelize.define('Users', {
        username: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                len: [3, 20] // Username must be between 3 and 20 characters
            }
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true // Ensures the value is a valid email format
            }
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })
    return users;
}