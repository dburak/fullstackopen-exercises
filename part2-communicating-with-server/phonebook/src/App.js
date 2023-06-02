import { useState } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 },
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');

  const filteredPersons = persons.filter((person) =>
    person.name.includes(filterName)
  );

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNumberChange = (e) => {
    setNewNumber(e.target.value);
  };

  const handleFilter = (e) => {
    setFilterName(e.target.value);
  };

  const addName = (e) => {
    e.preventDefault();
    const nameObj = { name: newName, number: newNumber };

    const isExist = persons.find((person) => person.name === nameObj.name);

    isExist
      ? alert(`${newName} is already added to phonebook`)
      : setPersons(persons.concat(nameObj));

    setNewName('');
    setNewNumber('');
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with{' '}
        <Filter filterName={filterName} handleFilter={handleFilter} />
      </div>
      <h3>add a new</h3>
      <PersonForm
        addName={addName}
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
      />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} />
    </div>
  );
};

export default App;
