const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherResultsContainer = document.getElementById("weather-results");
const apiKey = "IlXaHdA0nyqSuyzISttUkjGaJnpGWufR";

searchButton.addEventListener("click", async () => {
  const query = searchInput.value;
  const apiUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/37379?apikey=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    console.log("Error:", error);
  }
});

function displayWeather(data) {
  weatherResultsContainer.innerHTML = ""; 

  const location = data.location;
  const forecasts = data.DailyForecasts;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  forecasts.forEach((forecast, index) => {
    const date = new Date(forecast.Date);
    const dayOfWeek = daysOfWeek[date.getDay()]; 

    const minTemperature = forecast.Temperature.Minimum.Value;
    const maxTemperature = forecast.Temperature.Maximum.Value;
    const dayIcon = forecast.Day.IconPhrase;
    const nightIcon = forecast.Night.IconPhrase;

    const resultElement = document.createElement("div");
    resultElement.classList.add("weather-result");
    resultElement.innerHTML = `
      <h2>${dayOfWeek}</h2>
      <p>Date: ${date}</p>
      <p>Temperature: ${minTemperature}°F - ${maxTemperature}°F</p>
      <p>Day Icon: ${dayIcon}</p>
      <p>Night Icon: ${nightIcon}</p>
    `;

    weatherResultsContainer.appendChild(resultElement);
  });
}


searchInput.addEventListener("input", () => {
  if (searchInput.value === "") {
    weatherResultsContainer.innerHTML = "";
  }
});




