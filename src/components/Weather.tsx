"use client" // Ensures this is a client component

import { useState } from 'react'
import axios from 'axios'
import { NextPage } from 'next' // Import NextPage type

const Weather: NextPage = () => {
    const [city, setCity] = useState('')
    const [suggestions, setSuggestions] = useState<string[]>([])
    const [weather, setWeather] = useState<any>(null)
    

  const fetchWeather = async () => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      )
      setWeather(response.data)
    } catch (error) {
      console.error('Error fetching weather data:', error)
    }
  }

  const fetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }
    
    try {
      const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`
      )
      setSuggestions(response.data.list.map((city: any) => city.name + ', ' + city.sys.country))
    } catch (error) {
      console.error('Error fetching city suggestions:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCity(newValue)
    fetchSuggestions(newValue)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion)
    setSuggestions([])
    fetchWeather()
  }
  

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-4">Weather App</h1>
      <div className="relative">
        <div>
            <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city"
            className="p-2 border border-gray-300 rounded mb-4"
            />
            <button
                onClick={fetchWeather}
                className="bg-blue-500 text-white px-4 py-2 rounded"
            >
                Get Weather
            </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-300 mt-1 w-full max-h-40 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="p-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {weather && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold text-gray-900">{weather.name}</h2>
          <p className="text-lg text-gray-800">Temperature: {weather.main.temp}°C</p>
          <p className="text-lg text-gray-800">Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  )  
}

export default Weather
