const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');

const api = supertest(app);

const newBlog = {
  title: 'New title test post',
  author: 'Burak Diker',
  url: 'url',
  likes: 0,
};

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

test('creates a new blog post', async () => {
  const initialBlogs = await api.get('/api/blogs');

  await api.post('/api/blogs').send(newBlog).expect(201);

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

afterAll(async () => {
  await mongoose.connection.close();
});
