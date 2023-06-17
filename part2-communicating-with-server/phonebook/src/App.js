import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import Notification from './components/Notification';
import bookService from './services/books';

const App = () => {
  const [persons, setPersons] = useState([]);

  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filterName, setFilterName] = useState('');
  const [notification, setNotification] = useState({});

  useEffect(() => {
    const fetchInitialPersons = async () => {
      const response = await bookService.getAll();
      setPersons(response);
    };
    fetchInitialPersons();
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

        if (updatedPerson) {
          const updatedPersons = persons.map((person) =>
            person.id === updatedPerson.id ? updatedPerson : person
          );
          setPersons(updatedPersons);
        } else {
          setNotification({
            message: `Information of ${newName} has already been removed from server`,
            type: 'error',
          });
          setTimeout(() => {
            setNotification({ message: null });
          }, 5000);
        }
      }
    } else {
      try {
        const response = await bookService.create(nameObj);

        if (response.status === 201) {
          const newList = await bookService.getAll();

          setPersons(persons.concat(newList[newList.length - 1]));

          setNotification({
            message: `Added ${newName}`,
            type: 'success',
          });
        } else {
          setNotification({
            message: response.response.data.error,
            type: 'error',
          });
        }
      } catch (error) {
        console.log(error);
      }

      setTimeout(() => {
        setNotification({ message: null });
      }, 5000);
    }

    setNewName('');
    setNewNumber('');
  };

  const deleteName = (name, id) => {
    if (window.confirm(`Delete ${name} ?`)) {
      bookService.deletePerson(id);
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
      <Notification notification={notification} />
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
