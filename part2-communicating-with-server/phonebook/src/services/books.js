import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then((response) => response.data);
};

const create = (newObject) => {
  return axios
    .post(baseUrl, newObject)
    .then((response) => response)
    .catch((error) => error);
};

const deletePerson = (id) => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then((response) => console.log(response));
};

const update = (newObject) => {
  return axios
    .put(`${baseUrl}/${newObject.id}`, newObject)
    .then((response) => response.data)
    .catch((err) => console.log(err));
};

const bookService = { getAll, create, deletePerson, update };

export default bookService;
