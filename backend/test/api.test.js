const request = require('supertest');
const app = require('../index');

describe('Authentication API', () => {
  let testToken = '';
  const testUser = {
    username: `test_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: 'password123'
  };

  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/user/register')
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('User added successfully');
  });

  it('should login and return a JWT token', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
    testToken = res.body.token; // Save for protected routes
  });

  it('should return 400 for incorrect password', async () => {
    const res = await request(app)
      .post('/api/user/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('Invalid email or password!!');
  });
});