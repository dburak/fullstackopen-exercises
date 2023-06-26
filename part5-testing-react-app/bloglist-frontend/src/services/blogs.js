import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const createBlog = async (blog) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, blog, config);
  return response.data;
};

const updateLike = async (obj) => {
  const response = await axios.put(`${baseUrl}/${obj.id}`, obj);
  return response.data;
};

const deleteblog = async (obj) => {
  const config = {
    headers: { Authorization: token },
  };
  await axios.delete(`${baseUrl}/${obj.id}`, config);
};

// eslint-disable-next-line import/no-anonymous-default-export
export default { getAll, createBlog, setToken, updateLike, deleteblog };
