const {DataTypes}=require("sequelize");
const {sequelize}= require("../database/database");

const User = sequelize.define(
    "User",
    {
        id : {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email:{
            type: DataTypes.STRING,
            allowNull:false,
            unique:true,
            validate: {
                isEmail:true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role:{
            type: DataTypes.ENUM('user'),
            defaultValue:'user',
        },
        verificationToken: {
            type: DataTypes.STRING,
            allowNull: true
        },
        TokenExpires: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "users",
        timestamps: true,
    }
);

module.exports  = User;