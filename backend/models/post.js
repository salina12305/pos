const { DataTypes } = require('sequelize');
const { sequelize } = require('../database/database');

const Post = sequelize.define("Post", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    snippet: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING, // Stores the URL or file path
        allowNull: true
    },
    status: {
      type: DataTypes.ENUM('draft', 'published'),
      defaultValue: 'draft'
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    likes: {
      type: DataTypes.JSON, 
      defaultValue: []
    },
    comments: {
      type: DataTypes.JSON, 
      defaultValue: []
    }
}, {
  timestamps: true
});

module.exports = Post;