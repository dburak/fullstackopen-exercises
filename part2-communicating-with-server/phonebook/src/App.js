import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import axios from 'axios';
import bookService from './services/books';

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/persons').then((response) => {
      setPersons(response.data);
    });
  }, []);

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

  const addName = async (e) => {
    e.preventDefault();
    const nameObj = { name: newName, number: newNumber };

    const isExist = persons.find((person) => person.name === nameObj.name);
    const changedBook = { ...isExist, number: newNumber };

    if (isExist) {
      if (
        window.confirm(
          `${newName} is already added to phonebook, replace the old number with a new one ?`
        )
      ) {
        const updatedPerson = await bookService.update(changedBook);
        const updatedPersons = persons.map((person) =>
          person.id === updatedPerson.id ? updatedPerson : person
        );
        setPersons(updatedPersons);
      }
    } else {
      await bookService.create(nameObj);

      // we need this to delete a person directly after add new book without page reload
      const newList = await bookService.getAll();

      setPersons(persons.concat(newList[newList.length - 1]));
    }

    setNewName('');
    setNewNumber('');
  };

  const deleteName = async (name, id) => {
    if (window.confirm(`Delete ${name} ?`)) {
      await bookService.deletePerson(id);
      const updatedPersons = filteredPersons.filter(
        (person) => person.id !== id
      );
      setPersons(updatedPersons);
    }

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
      <Persons filteredPersons={filteredPersons} deleteName={deleteName} />
    </div>
  );
};

export default App;
