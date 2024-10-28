
import React, { useEffect, useState } from 'react';
import './Weather.css';
import SearchIcon from '../assets/search.png';
import ClearIcon from '../assets/clear.png';
import CloudIcon from '../assets/cluad.png';
import DrizzleIcon from '../assets/drizzle.png';
import RainIcon from '../assets/rain.png';
import SnowIcon from '../assets/snow.png';
import WindIcon from '../assets/wind.png';
import HumidityIcon from '../assets/humidity.png';

const Weather = () => {
  const [city, setCity] = useState('Kudachi'); 
  const [weatherData, setWeatherData] = useState(null);
  const [inputCity, setInputCity] = useState('');
  const [error, setError] = useState(null);

  const search = async (cityName) => {
    try {
      const apiKey = import.meta.env.VITE_APP_ID;
      if (!apiKey) {
        throw new Error("API key is missing");
      }
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("City not found or API error");
      }
      
      const data = await response.json();
      setWeatherData(data);
      setError(null); 
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError(error.message);
      setWeatherData(null);
    }
  };

  const handleSearchClick = () => {
    if (inputCity.trim()) {
      setCity(inputCity.trim());
      search(inputCity.trim());
      setInputCity(''); 
    }
  };

  useEffect(() => {
    search(city); 
  }, [city]);

  
  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return ClearIcon;
      case 'Clouds':
        return CloudIcon;
      case 'Drizzle':
        return DrizzleIcon;
      case 'Rain':
        return RainIcon;
      case 'Snow':
        return SnowIcon;
      default:
        return ClearIcon;
    }
  };

  return (
    <div className='Weather'>
      <div className="search-bar">
        <input
          type="text"
          placeholder='Enter city name'
          value={inputCity}
          onChange={(e) => setInputCity(e.target.value)}
        />
        <img
          src={SearchIcon}
          alt="search icon"
          onClick={handleSearchClick}
          style={{ cursor: 'pointer' }}
        />
      </div>

      {error ? (
        <p>{error}. Please try another city.</p>
      ) : weatherData ? (
        <>
          <img
            src={getWeatherIcon(weatherData.weather[0].main)}
            alt="weather icon"
            className='Weather-icon'
          />
          <p className='temperature'>{Math.round(weatherData.main.temp)}°C</p>
          <p className='location'>{weatherData.name}</p>
          <div className="Weather-date">
            <div className="col">
              <img src={HumidityIcon} alt="humidity icon" />
              <div>
                <p>{weatherData.main.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={WindIcon} alt="wind icon" />
              <div>
                <p>{weatherData.wind.speed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Weather;

