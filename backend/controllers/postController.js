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

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post first to check existence
    const post = await Post.findByPk(id);

    if (!post) {
      return res.status(404).json({ success: false, message: "Post not found" });
    }

    // Optional: Check if the user deleting is the owner
    // if (post.userId !== req.user.id) { return res.status(403).json(...) }

    await post.destroy();

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    // Ensure currentLikes is an array (and not a reference to the old one)
    let currentLikes = Array.isArray(post.likes) ? [...post.likes] : [];

    const userIdStr = String(userId);
    const index = currentLikes.indexOf(userIdStr);

    if (index === -1) {
      currentLikes.push(userIdStr); // Add like
    } else {
      currentLikes.splice(index, 1); // Remove like
    }

    // Assign the NEW array to the post
    post.likes = currentLikes; 
    
    // CRITICAL: Tell Sequelize the JSON field has changed
    post.changed('likes', true); 

    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error("Server Like Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, user } = req.body;

    if (!text) return res.status(400).json({ success: false, message: "Comment text is required" });

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    // 1. Create a new copy of the existing comments array
    const currentComments = Array.isArray(post.comments) ? [...post.comments] : [];

    // 2. Build the new comment object
    const newComment = {
      id: Date.now(), // Simple unique ID
      user: user || "Anonymous",
      text: text,
      createdAt: new Date()
    };

    // 3. Push and Save
    currentComments.push(newComment);
    post.comments = currentComments;
    
    // 4. CRITICAL: Force Sequelize to recognize the change
    post.changed('comments', true); 
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error("Comment Error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
    createPost,
    getPublishedPosts,
    getDraftsByUser,
    deletePost,
    likePost,
    addComment
};