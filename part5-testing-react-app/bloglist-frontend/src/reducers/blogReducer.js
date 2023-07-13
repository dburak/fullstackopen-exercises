import { createSlice } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(state, action) {
      return action.payload;
    },
    createBlog(state, action) {
      return state.concat(action.payload);
    },
    likeBlog(state, action) {
      const likedBlog = action.payload;
      return state.map((s) => (s.id === likedBlog.id ? likedBlog : s));
    },
    deleteblog(state, action) {
      console.log(action.payload);
      const deletedblog = action.payload;
      return state.filter((s) => s.id !== deletedblog.id);
    },
    sortBlogsByLikes(state) {
      return state.slice().sort((a, b) => b.likes - a.likes);
    },
  },
});

export const setReduxBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll();
    dispatch(setBlogs(blogs));
    dispatch(sortBlogsByLikes());
  };
};

export const createReduxBlog = (obj) => {
  return async (dispatch) => {
    const blog = await blogService.createBlog(obj);
    dispatch(createBlog(blog));
  };
};

export const likeReduxBlog = (blog) => {
  return async (dispatch) => {
    const updatedObj = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user[0].id,
    };

    const updatedBlog = await blogService.updateLike(updatedObj);
    dispatch(likeBlog(updatedBlog));
    dispatch(sortBlogsByLikes());
  };
};

export const deleteReduxBlog = (blog) => {
  return async (dispatch) => {
    await blogService.deleteblog(blog);
    dispatch(deleteblog(blog));
  };
};

export const { setBlogs, createBlog, likeBlog, deleteblog, sortBlogsByLikes } =
  blogSlice.actions;
export default blogSlice.reducer;
