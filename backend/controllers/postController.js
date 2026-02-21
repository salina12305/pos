const Post = require('../models/post');

const createPost = async (req, res) => {
    try {
        const { title, snippet, status, author, userId } = req.body;
        
        // Multer puts the file info in req.file
        if (!req.file) {
            return res.status(400).json({ success: false, message: "Please upload an image." });
        }

        const newPost = await Post.create({
            title,
            snippet,
            status: status || 'published',
            author,
            userId,
            image: req.file.filename // We only store the filename (e.g., 1712345-pic.jpg)
        });

        res.status(201).json({ success: true, data: newPost });
    } catch (error) {
      console.error("Post Creation Error:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

const getPublishedPosts = async (req, res) => {
    try {
      const posts = await Post.findAll({
        where: { status: 'published' },
        order: [['createdAt', 'DESC']]
      });
      res.status(200).json({ success: true, data: posts });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

const getDraftsByUser = async (req, res) => {
    try {
        const drafts = await Post.findAll({
            where: { userId: req.params.userId, status: 'draft' },
            order: [['updatedAt', 'DESC']]
        });
        res.status(200).json({ success: true, data: drafts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createPost,
    getPublishedPosts,
    getDraftsByUser
};