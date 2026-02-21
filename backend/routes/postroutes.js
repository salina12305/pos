const router = require("express").Router();
const postController = require('../controllers/postController');
const authGuard = require("../helpers/authGuard");
const upload = require("../middleware/upload");

// Path: /api/posts/create
router.post('/create', authGuard, upload.single('image'), postController.createPost);

// Path: /api/posts/get_published
router.get('/get_published', authGuard, postController.getPublishedPosts);

router.get('/get_drafts/:userId', authGuard, postController.getDraftsByUser);

module.exports = router;