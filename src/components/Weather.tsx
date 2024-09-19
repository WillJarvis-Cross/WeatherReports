"use client" // Ensures this is a client component

import { useState } from 'react'
import axios from 'axios'
import { NextPage } from 'next' // Import NextPage type

const Weather: NextPage = () => {
  const [city, setCity] = useState('')
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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h1 className="text-4xl font-bold mb-4">Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
        className="p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={fetchWeather}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Get Weather
      </button>
      {weather && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-semibold">{weather.name}</h2>
          <p className="text-lg">Temperature: {weather.main.temp}°C</p>
          <p className="text-lg">Weather: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  )
}

export default Weather
