require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
const Phonebook = require('./models/phonebook');

app.use(express.json());
app.use(cors());
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('build'));

app.get('/api/persons', (req, res) => {
  Phonebook.find({}).then((phonebook) => res.json(phonebook));
});

app.get('/api/persons/:id', async (req, res, next) => {
  // Phonebook.findById(req.params.id)
  //   .then((result) => {
  //     result ? res.json(result) : res.status(404).end();
  //   })
  //   .catch((error) => {
  //     next(error);
  //   });

  // Alternative way
  try {
    const result = await Phonebook.findById(req.params.id);
    result ? res.json(result) : res.status(404).end();
  } catch (error) {
    next(error);
  }
});

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body;

  const phonebook = {
    name: body.name,
    number: body.number,
  };

  Phonebook.findByIdAndUpdate(req.params.id, phonebook, { new: true })
    .then((updatedPhonebook) => res.json(updatedPhonebook))
    .catch((err) => next(err));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Phonebook.findByIdAndDelete(req.params.id)
    .then((result) => {
      if (result) {
        res.status(204).end();
      } else {
        res.status(404).send('Contact with given ID cannot be found');
      }
    })
    .catch((err) => next(err));
});

app.post('/api/persons', (req, res, next) => {
  const body = req.body;

  if (body.name === undefined) {
    return res.status(400).json({ error: 'content missing' });
  }

  const phonebook = new Phonebook({
    name: body.name,
    number: body.number,
  });

  phonebook
    .save()
    .then((savedContact) => res.status(201).json(savedContact))
    .catch((error) => next(error));

  // const id = Math.floor(Math.random() * 50);

  // const isNameExist = phonebook.find((p) => p.name === contact.name);

  // if (isNameExist) {
  //   res.status(400).json({ error: 'name must be unique' });
  // } else if (!contact.name || !contact.number) {
  //   res.status(400).json({ error: 'The name or number is missing' });
  // } else {
  //   contact.id = id;

  //   phonebook = phonebook.concat(contact);

  //   res.status(201).json(phonebook);
  // }
});

app.get('/info', async (req, res) => {
  const currentTime = new Date().toLocaleString('en-US');
  const contacts = await Phonebook.find({});
  res.send(
    `<p>Phonebook has info for ${contacts.length} people</p><p>${currentTime}</p>`
  );
});

app.get('/', (req, res) => {
  res.send('ok');
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
