const express = require('express');
const app = express();

app.use(express.json());

let phonebook = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/api/persons', (req, res) => {
  res.json(phonebook);
});

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  const person = phonebook.find((p) => p.id === id);

  !person ? res.status(204).end() : res.json(person);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);

  phonebook = phonebook.filter((p) => p.id !== id);

  res.json(phonebook);
});

app.post('/api/persons', (req, res) => {
  const contact = req.body;

  const id = Math.floor(Math.random() * 50);

  const isNameExist = phonebook.find((p) => p.name === contact.name);

  if (isNameExist) {
    res.status(400).json({ error: 'name must be unique' });
  } else if (!contact.name || !contact.number) {
    res.status(400).json({ error: 'The name or number is missing' });
  } else {
    contact.id = id;

    phonebook = phonebook.concat(contact);

    res.status(201).json(phonebook);
  }
});

app.get('/info', (req, res) => {
  const currentTime = new Date().toLocaleString('en-US');
  res.send(
    `<p>Phonebook has info for ${phonebook.length} people</p><p>${currentTime}</p>`
  );
});

app.get('/', (req, res) => {
  res.send('ok');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
