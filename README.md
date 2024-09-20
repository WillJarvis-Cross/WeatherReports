This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

This is a web application for weather reports. Enter in any city into the text input, and it will show the current weather for that city. The data comes from OpenWeatherMap (https://openweathermap.org/weather-dashboard)

## Dev Process

Run the development server using `npm run dev`

## Production

To push code to production, all you have to do is push to the github repo. AWS Amplify is configured to recognized when the github repo changes, and it redeploys the app. Here is the live link where you can find the website: https://main.drabnf4sejs0a.amplifyapp.com/

I used Amplify as it is easy to setup automatic deployment and routing configurations. It builds the project for you, and has a built in CI/CD pipeline. It is easy to add small backend requirements like authentication and user information (by doing `amplify add auth` and `amplify add api`)
