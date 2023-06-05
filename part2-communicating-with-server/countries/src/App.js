import { useState, useEffect } from 'react';
import axios from 'axios';
const API_KEY = process.env.REACT_APP_API_KEY;

function App() {
  const [countries, setCountries] = useState([]);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [weather, setWeather] = useState(null);
  const [capital, setCapital] = useState(null);
  const [filteredCountries, setFilteredCountries] = useState([]);

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

  useEffect(() => {
    if (name) {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(name.toLowerCase())
      );
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
    }
  }, [name, countries]);

  useEffect(() => {
    if (filteredCountries.length === 1) {
      setCapital(filteredCountries[0].name.common);
    }
  }, [filteredCountries]);

  useEffect(() => {
    if (capital) {
      axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?q=${capital}&APPID=${API_KEY}&units=metric`
        )
        .then((response) => {
          setWeather(response.data);
        });
    }
  }, [capital]);

  const handleInput = (e) => {
    const value = e.target.value;
    setName(value);
    setSelectedCountry(null);
  };

  const handleShow = (country) => {
    setSelectedCountry(country);
    setCapital(country.capital);
  };

  return (
    <>
      <div>
        find countries <input onChange={handleInput} />
        <br />
        {isLoading ? (
          <p style={{ fontStyle: 'italic' }}>Loading...</p>
        ) : filteredCountries.length > 10 && filteredCountries.length < 249 ? (
          <p>Too many matches, specify another filter</p>
        ) : filteredCountries.length > 1 && !selectedCountry ? (
          filteredCountries.map((country) => (
            <p key={country.name.common}>
              {country.name.common}{' '}
              <button onClick={() => handleShow(country)}>show</button>
            </p>
          ))
        ) : filteredCountries.length === 1 ? (
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
                <h3>Weather in {country.capital}</h3>
                {weather && (
                  <div>
                    <p>temperature {weather.main.temp} Celcius</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                    />
                    <p>wind {weather.wind.speed} m/s</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          selectedCountry && (
            <div key={selectedCountry.name.common}>
              <h2>{selectedCountry.name.common}</h2>
              <p>capital {selectedCountry.capital}</p>
              <p>area {selectedCountry.area}</p>
              <h4>languages:</h4>
              <ul>
                {Object.values(selectedCountry.languages).map((language) => (
                  <li key={language}>{language}</li>
                ))}
              </ul>
              <img
                style={{ width: 170 }}
                src={selectedCountry.flags.png}
                alt={selectedCountry.flags.alt}
              />
              <h3>Weather in {selectedCountry.capital}</h3>
              {weather && (
                <div>
                  <p>temperature {weather.main.temp} Celcius</p>
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                  />
                  <p>wind {weather.wind.speed} m/s</p>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </>
  );
}

export default App;
