import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (name) {
      setIsLoading(true);
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then((response) => {
          setCountries(response.data);
          setIsLoading(false);
        });
    } else {
      setCountries([]);
    }
  }, [name]);

  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(name)
  );

  const handleInput = (e) => {
    setName(e.target.value);
  };

  console.log(filteredCountries);

  return (
    <>
      <div>
        find countries <input onChange={handleInput} />
        <br />
        {isLoading ? (
          <p style={{ fontStyle: 'italic' }}>Searching...</p>
        ) : filteredCountries.length > 10 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length > 1 ? (
          filteredCountries.map((country) => (
            <p key={country.name.common}>{country.name.common}</p>
          ))
        ) : (
          filteredCountries.map((country) => {
            return (
              <div key={country.name.common}>
                <h2>{country.name.common}</h2>
                <p>capital {country.capital}</p>
                <p>area {country.area}</p>
                <h4>languages:</h4>
                <ul>
                  {Object.values(country.languages).map((language) => (
                    <li key={language}>{language}</li>
                  ))}
                </ul>
                <img
                  style={{ width: 170 }}
                  src={country.flags.png}
                  alt={country.flags.alt}
                />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default App;
