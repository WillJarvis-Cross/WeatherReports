import axios from 'axios'

const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY

// Fetches weather data using API key
export const fetchWeather = async (city: string) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

// This fetches city autocomplete suggestions
export const fetchCitySuggestions = async (query: string) => {
  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&appid=${apiKey}`
    )
    return response.data.list
  } catch (error) {
    console.error('Error fetching city suggestions:', error)
    throw error
  }
}
