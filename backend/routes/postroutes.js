const router = require("express").Router();
const postController = require('../controllers/postController');
const authGuard = require("../helpers/authGuard");
const upload = require("../middleware/upload");

// Path: /api/posts/create
router.post('/create', authGuard, upload.single('image'), postController.createPost);
router.get('/get_published', authGuard, postController.getPublishedPosts);
router.get('/get_drafts/:userId', authGuard, postController.getDraftsByUser);
router.delete('/delete/:id', authGuard, postController.deletePost);

router.put('/like/:id', authGuard, postController.likePost);
router.post('/comment/:id', authGuard, postController.addComment);
router.put('/comment/update/:postId/:commentId', authGuard, postController.updateComment);
router.delete('/comment/delete/:postId/:commentId', authGuard, postController.deleteComment);

module.exports = router;