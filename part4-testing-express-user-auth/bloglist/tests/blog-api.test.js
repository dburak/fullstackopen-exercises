const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test-helper');
const app = require('../app');
const config = require('../utils/config');

const api = supertest(app);

const newBlog = {
  title: 'New title test with auth',
  author: 'Burak Diker',
  url: 'url',
  likes: 0,
};

const newUser = {
  username: 'root',
  password: '123456',
};

test('login', async () => {
  const res = await api.post('/api/login').send(newUser);
  console.log(res);
});

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);
});

test('verifies that the unique identifier property of the blog posts', async () => {
  const result = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  for (const blogPost of result.body) {
    expect(blogPost.id).toBeDefined();
  }
});

describe('addition of a new blog', () => {
  test('creates a new blog post with no auth', async () => {
    await api.post('/api/blogs').send(newBlog).expect(401);
  });

  test('Successfully creates a new blog post with auth', async () => {
    const initialBlogs = await api.get('/api/blogs');

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
      .send(newBlog)
      .expect(201);

    const updatedBlogs = await api.get('/api/blogs');
    expect(updatedBlogs.body.length).toBe(initialBlogs.body.length + 1);
  });

  test('verifies that if the likes property is missing from the request', async () => {
    const result = await api.post('/api/blogs').send(newBlog).expect(201);

    const createdBlog = result.body;

    expect(createdBlog.likes).toBeDefined();
    expect(createdBlog.likes).toBe(0);
  });

  test('verify that if the title or url properties are missing from the request data', async () => {
    await api.post('/api/blogs').send(newBlog).expect(400);
  });
});

test('deleting a single blog post resource', async () => {
  await api
    .delete('/api/blogs/6496292e2c9e47561f5338a3')
    .set('Authorization', `Bearer ${config.TEST_TOKEN}`)
    .expect(204);
});

test('updating the information of an individual blog post', async () => {
  const updatedBlog = {
    title: 'Updated Title',
    author: 'Burak Diker',
    url: 'url',
    likes: 2,
  };

  const result = await api
    .put('/api/blogs/6491d6ed58b4a6ac689d267e')
    .send(updatedBlog);

  expect(result.status).toBe(200);

  expect(result.body.likes).toBe(updatedBlog.likes);
});

describe('user related operations', () => {
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'root',
      name: 'burak',
      password: '123456',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    expect(result.body.error).toContain('expected `username` to be unique');

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toEqual(usersAtStart);
  });

  test('Successful user creation', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'burak',
      name: 'Burak Diker',
      password: '123456',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });
});

test('Both username and password must be at least 3 characters long', async () => {
  const usernameTest = {
    username: 'bu',
    name: 'Burak Diker',
    password: '123456',
  };

  const passwordTest = {
    username: 'burak',
    name: 'Burak Diker',
    password: '12',
  };

  await api
    .post('/api/users')
    .send(usernameTest)
    .expect(400)
    .expect('Content-Type', /application\/json/);

  await api
    .post('/api/users')
    .send(passwordTest)
    .expect(400)
    .expect('Content-Type', /application\/json/);
});

afterAll(async () => {
  await mongoose.connection.close();
});
