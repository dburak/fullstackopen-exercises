import React from 'react';

const Persons = ({ filteredPersons, deleteName }) => {
  return (
    <>
      {filteredPersons.map((person) => (
        <div key={person.name}>
          {person.name} {person.number}{' '}
          <button onClick={() => deleteName(person.name, person.id)}>
            delete
          </button>
        </div>
      ))}
    </>
  );
};

export default Persons;
