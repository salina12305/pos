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
    const { userId } = req.params; // Get ID from URL
    const drafts = await Post.findAll({
      where: { 
        userId: userId, 
        status: 'draft' 
      },
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

const updatePost = async (req, res) => {
  try {
      const { id } = req.params;
      const { title, snippet } = req.body;
      let imageName = req.body.image; // Keep old image name by default

      // If a new file was uploaded via multer
      if (req.file) {
          imageName = req.file.filename;
      }

      const post = await Post.findByPk(id);
      if (!post) return res.status(404).json({ success: false, message: "Post not found" });

      // Update fields
      post.title = title || post.title;
      post.snippet = snippet || post.snippet;
      post.image = imageName;

      await post.save();

      res.status(200).json({ 
          success: true, 
          message: "Post updated successfully", 
          data: post 
      });
  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
};

const getSinglePost = async (req, res) => {
  try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
          return res.status(404).json({ success: false, message: "Post not found" });
      }
      res.status(200).json({ success: true, data: post });
  } catch (error) {
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
    const { text, user, userId } = req.body;

    if (!text) return res.status(400).json({ success: false, message: "Comment text is required" });

    const post = await Post.findByPk(id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    // 1. Create a new copy of the existing comments array
    const currentComments = Array.isArray(post.comments) ? [...post.comments] : [];

    // 2. Build the new comment object
    const newComment = {
      id: Date.now().toString(), // Simple unique ID
      userId: userId,
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

const updateComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { text, userId } = req.body;

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    // Use a fresh copy of the array
    const comments = Array.isArray(post.comments) ? [...post.comments] : [];
    
    // Safety check: find the index using string comparison
    const index = comments.findIndex(c => String(c.id) === String(commentId));

    if (index === -1) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // Owner check
    if (String(comments[index].userId) !== String(userId)) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Update the data
    comments[index].text = text;
    comments[index].updatedAt = new Date();

    // Reassign and save
    post.comments = comments;
    post.changed('comments', true); 
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body; // The ID of the person trying to delete

    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const comments = Array.isArray(post.comments) ? [...post.comments] : [];
    const commentIndex = comments.findIndex(c => String(c.id) === String(commentId));

    if (commentIndex === -1) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    // AUTH CHECK: Is it the comment owner OR the post owner?
    const isCommentOwner = String(comments[commentIndex].userId) === String(userId);
    const isPostOwner = String(post.userId) === String(userId);

    if (!isCommentOwner && !isPostOwner) {
      return res.status(403).json({ success: false, message: "Unauthorized to delete this comment" });
    }

    // Remove the comment
    comments.splice(commentIndex, 1);

    post.comments = comments;
    post.changed('comments', true);
    await post.save();

    res.status(200).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
    createPost,
    getPublishedPosts,
    getDraftsByUser,
    deletePost,
    updatePost,
    getSinglePost,
    likePost,
    addComment,
    updateComment,
    deleteComment
};