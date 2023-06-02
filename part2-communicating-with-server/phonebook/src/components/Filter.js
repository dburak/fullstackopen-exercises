import React from 'react';

const Filter = ({ filterName, handleFilter }) => {
  return (
    <>
      <input value={filterName} onChange={handleFilter} />
    </>
  );
};

export default Filter;
