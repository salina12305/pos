const express = require("express");
const path = require('path');
const cors = require("cors");
const { sequelize, connectDB } = require("./database/database");

// Models
const User = require("./models/usermodel");
const Post = require("./models/post");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// This tells Express: When someone asks for "/uploads/...", 
// look inside the "public/uploads" folder on my computer.
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use("/api/user/", require('./routes/userroutes'));

// --- ADD THIS: Post routes ---
app.use("/api/posts", require('./routes/postroutes')); 

app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Home Page" });
});


//FOR PROJECT

// const PORT = 3000;

// const startServer = async () => {
//     try {
//         await connectDB();
//         // sync({alter: true}) will update your Postgres tables to include the 'Posts' table
//         await sequelize.sync({ alter: true });
//         console.log("Database synced successfully");

//         app.listen(PORT, () => {
//             console.log(`Server is running on port ${PORT}`);
//         });
//     } catch (error) {
//         console.error("Failed to start server:", error);
//     }
// };

// startServer();

// FOR TEST

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        if (process.env.NODE_ENV === 'test') {
            await sequelize.sync({ force: true });
        } else {
            await sequelize.sync({ alter: true });
        }

        if (process.env.NODE_ENV !== 'test') {
            app.listen(PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            });
        }

    } catch (error) {
        console.error("Failed to start server:", error);
    }
};

startServer();

module.exports = app;