// // 1.
// // for aauthentication
// const request = require('supertest');
// const app = require('../index');

// describe('Authentication API', () => {
//   let testToken = '';
//   const testUser = {
//     username: `test_${Date.now()}`,
//     email: `test_${Date.now()}@example.com`,
//     password: 'password123'
//   };

//   it('should register a new user successfully', async () => {
//     const res = await request(app)
//       .post('/api/user/register')
//       .send(testUser);

//     expect(res.status).toBe(201);
//     expect(res.body.success).toBe(true);
//     expect(res.body.message).toBe('User added successfully');
//   });

//   it('should login and return a JWT token', async () => {
//     const res = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: testUser.email,
//         password: testUser.password
//       });

//     expect(res.status).toBe(200);
//     expect(res.body.success).toBe(true);
//     expect(res.body.token).toBeDefined();
//     testToken = res.body.token; // Save for protected routes
//   });

//   it('should return 400 for incorrect password', async () => {
//     const res = await request(app)
//       .post('/api/user/login')
//       .send({
//         email: testUser.email,
//         password: 'wrongpassword'
//       });

//     expect(res.status).toBe(400);
//     expect(res.body.message).toBe('Invalid email or password!!');
//   });
// });


// // 2.
// // post
// const request = require('supertest');
// const path = require('path');
// const fs = require('fs');
// const app = require('../index'); 
// const { sequelize } = require('../database/database');
// const Post = require('../models/post');

// // Mock Auth
// jest.mock('../helpers/authGuard', () => (req, res, next) => {
//     req.user = { id: "1", username: 'Tester' };
//     next();
// });

// describe('Post CRUD API Tests', () => {
//     let createdPostId;

//     beforeAll(async () => {
//         await new Promise(resolve => setTimeout(resolve, 2000)); 
//         await sequelize.authenticate();
//         await Post.destroy({ where: {}, cascade: true });

//         const uploadDir = path.join(__dirname, '../uploads');
//         if (!fs.existsSync(uploadDir)) {
//             fs.mkdirSync(uploadDir);
//         }
//     });

//     afterAll(async () => {
//         // Only close AFTER everything is done
//         await sequelize.close();
//     });

//     it('should create a new post', async () => {
//         const res = await request(app)
//             .post('/api/posts/create')
//             .field('title', 'Stooory')
//             .field('snippet', 'Once upon the time...')
//             .field('status', 'published')
//             .field('author', 'Tester')
//             .field('userId', '1')
//             .attach('image', path.join(__dirname, 'sample.jpg')); 

//         expect(res.statusCode).toBe(201);
//         createdPostId = res.body.data.id;
//     });

//     it('should update the post content', async () => {
//         const res = await request(app)
//             .put(`/api/posts/update/${createdPostId}`)
//             .send({ title: 'Updateee' });

//         expect(res.statusCode).toBe(200);
//     });

//     it('should delete the post', async () => {
//         const res = await request(app)
//             .delete(`/api/posts/delete/${createdPostId}`);

//         expect(res.statusCode).toBe(200);
//     });
// });

// // 3.
// // for comment
// const request = require('supertest');
// const path = require('path');

// // 1. MOCK AUTHGUARD BEFORE REQUIRING APP
// jest.mock('../helpers/authGuard', () => (req, res, next) => {
//     req.user = { id: "user_123", username: 'testuser' };
//     next();
// });

// const app = require('../index'); 
// const { sequelize } = require('../database/database');
// const Post = require('../models/post');

// describe('Comment System API Tests', () => {
//     let postId;
//     let commentId;

//     beforeAll(async () => {
//         // Wait for index.js background sync
//         await new Promise(resolve => setTimeout(resolve, 1500));
//         await sequelize.authenticate();

//         // Clear existing data without dropping tables (avoids enum errors)
//         await Post.destroy({ where: {}, truncate: true, cascade: true });

//         const post = await Post.create({
//             title: 'Comment Test Post',
//             snippet: 'Testing logic...',
//             author: 'Tester',
//             userId: 'user_123',
//             status: 'published'
//         });
//         postId = post.id;
//     });

//     afterAll(async () => {
//         await sequelize.close();
//     });

//     it('should add a comment', async () => {
//       const res = await request(app)
//           .post(`/api/posts/comment/${postId}`) // Correct
//           .set('Authorization', 'Bearer fake-token')
//           .send({
//               text: "Comment",
//               user: "tester",
//               userId: "user_123"
//           });

//       expect(res.statusCode).toBe(200);
//       expect(res.body.success).toBe(true);
//       commentId = res.body.data.comments[0].id;
//   });

//   it('should update the comment', async () => {
//       // Updated URL to include '/update/'
//       const res = await request(app)
//           .put(`/api/posts/comment/update/${postId}/${commentId}`) 
//           .set('Authorization', 'Bearer fake-token')
//           .send({
//               text: "Update Text",
//               userId: "user_123"
//           });

//       expect(res.statusCode).toBe(200);
//       // Note: Check if your controller returns the post in 'data' or 'post'
//       expect(res.body.data.comments[0].text).toBe("Update Text");
//   });

//   it('should delete the comment', async () => {
//       // Updated URL to include '/delete/'
//       const res = await request(app)
//           .delete(`/api/posts/comment/delete/${postId}/${commentId}`)
//           .set('Authorization', 'Bearer fake-token')
//           .send({ userId: "user_123" });

//       expect(res.statusCode).toBe(200);
//       expect(res.body.data.comments.length).toBe(0);
//   });
// });


// 4.
// for like
const request = require('supertest');
const path = require('path');

// 1. MOCK AUTHGUARD
jest.mock('../helpers/authGuard', () => (req, res, next) => {
    req.user = { id: "user_123", username: 'testuser' };
    next();
});

const app = require('../index'); 
const { sequelize } = require('../database/database');
const Post = require('../models/post');

describe('Post Like System API Tests', () => {
    let postId;

    beforeAll(async () => {
        // Wait for index.js background sync
        await new Promise(resolve => setTimeout(resolve, 1500));
        await sequelize.authenticate();

        // Clear table
        await Post.destroy({ where: {}, truncate: true, cascade: true });

        // Create a post to like
        const post = await Post.create({
            title: 'Like Test Post',
            snippet: 'Testing likes...',
            author: 'Tester',
            userId: 'user_999', // Post owner is someone else
            status: 'published',
            likes: [] // Initial empty likes
        });
        postId = post.id;
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it('should like a post (add userId to likes array)', async () => {
      const res = await request(app)
          .put(`/api/posts/like/${postId}`)
          .set('Authorization', 'Bearer fake-token')
          .send({ userId: "user_123" }); 

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.likes).toContain("user_123");
  });

  it('should unlike the post (remove userId from likes array)', async () => {
      const res = await request(app)
          .put(`/api/posts/like/${postId}`)
          .set('Authorization', 'Bearer fake-token')
          .send({ userId: "user_123" }); 

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.likes).not.toContain("user_123");
  });
});