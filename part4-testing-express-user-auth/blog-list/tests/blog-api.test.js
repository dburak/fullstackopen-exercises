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

describe('addition of a new note', () => {
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
});

test('deleting a single blog post resource', async () => {
  await api.delete('/api/blogs/6491d6f058b4a6ac689d2680');
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

afterAll(async () => {
  await mongoose.connection.close();
});
