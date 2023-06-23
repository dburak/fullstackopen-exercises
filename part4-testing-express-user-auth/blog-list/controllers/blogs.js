const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post(
  '/',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    const { title, url } = request.body;
    const userId = request.user.id;

    try {
      const user = await User.findById(userId);

      if (!title || !url) {
        response.status(400).end();
      } else {
        const blog = new Blog({
          ...request.body,
          user: userId,
        });

        user.blogs = user.blogs.concat(blog._id);

        const savedBlog = await blog.save();

        user.save();

        response.status(201).json(savedBlog);
      }
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.delete(
  '/:id',
  middleware.tokenExtractor,
  middleware.userExtractor,
  async (request, response, next) => {
    try {
      const user = request.user;
      const blog = await Blog.findById(request.params.id);

      if (blog) {
        if (blog.user.toString() === user.id) {
          const res = await Blog.findByIdAndDelete(request.params.id);
          response.status(204).json(res);
        } else {
          response
            .status(400)
            .json({ error: "The blog's user id and token id cannot match" });
        }
      } else {
        response
          .status(404)
          .json({ error: 'Blog with given id cannot be found' });
      }
    } catch (error) {
      next(error);
    }
  }
);

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body;

  const blog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {
      new: true,
    });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
