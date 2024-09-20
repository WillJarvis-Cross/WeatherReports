'use client' // Ensures this is a client component

import { useState } from 'react'
import { NextPage } from 'next'
import { fetchCitySuggestions, fetchWeather } from '@/services/WeatherService'

interface WeatherData {
  name: string
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: {
    description: string
  }[]
  sys: {
    sunrise: number
    sunset: number
  }
}

interface City {
  name: string
  sys: {
    country: string
  }
}

interface ApiResponse {
  list: City[]
}

type WeatherCondition = 'clear' | 'rain' | 'snow' | 'clouds'

// Utility function to format time
const formatTime = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleTimeString()
}

const Weather: NextPage = () => {
  const [city, setCity] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [background, setBackground] = useState(
    'https://weather-reports-djvbsdjsk.s3.amazonaws.com/sunny.jpg'
  )

  const backgroundImages: Record<WeatherCondition, string> = {
    clear: 'https://weather-reports-djvbsdjsk.s3.amazonaws.com/sunny.jpg',
    rain: 'https://weather-reports-djvbsdjsk.s3.amazonaws.com/rainy.jpg',
    snow: 'https://weather-reports-djvbsdjsk.s3.amazonaws.com/snowy.jpg',
    clouds: 'https://weather-reports-djvbsdjsk.s3.amazonaws.com/cloudy.jpg',
  }

  // Updates the background image based on the weather condition
  const setWeatherBackground = (weatherCondition: WeatherCondition | undefined) => {
    setBackground(backgroundImages[weatherCondition as WeatherCondition] || backgroundImages.clear)
  }

  // Fetches weather data for the input city
  const handleFetchWeather = async () => {
    try {
      const weatherData = await fetchWeather(city)
      setWeather(weatherData)
      const weatherCondition = weatherData.weather[0].main.toLowerCase()
      setWeatherBackground(weatherCondition as WeatherCondition)
    } catch (error) {
      console.error('Failed to fetch weather:', error)
    }
  }

  // Fetches city suggestions as the user types in the input field
  const handleFetchSuggestions = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([])
      return
    }

    try {
      const cities = await fetchCitySuggestions(query)
      // Create an array of formatted city names (city name, country code)
      setSuggestions(cities.map((city: City) => `${city.name}, ${city.sys.country}`))
    } catch (error) {
      console.error('Failed to fetch suggestions:', error)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCity(newValue)
    handleFetchSuggestions(newValue)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCity(suggestion)
    setSuggestions([])
    handleFetchWeather()
  }


  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-blue-100"
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
      }}
    >
      <h1 className="text-4xl font-bold mb-4">Weather App</h1>
      <div className="relative">
        <div className="space-x-4">
          <input
            type="text"
            value={city}
            onChange={handleInputChange}
            placeholder="Enter city"
            className="p-2 border border-gray-300 rounded mb-4"
          />
          <button
            onClick={handleFetchWeather}
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
          <h2 className="text-2xl font-semibold text-gray-900">
            {weather.name}
          </h2>
          <p className="text-lg text-gray-800">
            Temperature: {weather.main.temp}°C
          </p>
          <p className="text-lg text-gray-800">
            Feels Like: {weather.main.feels_like}°C
          </p>
          <p className="text-lg text-gray-800">
            Humidity: {weather.main.humidity}
          </p>
          <p className="text-lg text-gray-800">
            Weather: {weather.weather[0].description}
          </p>
          <p className="text-lg text-gray-800">
            Sunrise: {formatTime(weather.sys.sunrise)}
          </p>
          <p className="text-lg text-gray-800">
            Sunset: {formatTime(weather.sys.sunset)}
          </p>
        </div>
      )}
    </div>
  )
}

export default Weather
