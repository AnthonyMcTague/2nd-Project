const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const weatherResultsContainer = document.getElementById("weather-results");
const apiKey = "IlXaHdA0nyqSuyzISttUkjGaJnpGWufR";

searchButton.addEventListener("click", getWeatherData);
searchInput.addEventListener("keydown", handleEnterKey);
searchInput.addEventListener("input", clearWeatherResults);

async function getWeatherData() {
  const query = searchInput.value;
  const locationKey = await getLocationKey(query);

  if (locationKey) {
    const apiUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

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
  }
}

async function getLocationKey(query) {
  const apiLocationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${query}`;

  try {
    const response = await fetch(apiLocationUrl);
    if (!response.ok) {
      throw new Error("Location data not available");
    }

    const data = await response.json();
    if (data && data[0] && data[0].Key) {
      return data[0].Key;
    } else {
      throw new Error("Location key not found");
    }
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
}



function handleEnterKey(event) {
  if (event.key === "Enter") {
    getWeatherData();
  }
}

function clearWeatherResults() {
  weatherResultsContainer.innerHTML = "";
}

function displayWeather(data) {
  clearWeatherResults();

  const location = data.location;
  const forecasts = data.DailyForecasts;

  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  forecasts.forEach((forecast, index) => {
    const date = new Date(forecast.Date);
    const dayOfWeek = daysOfWeek[date.getDay()];

    const minTemperature = forecast.Temperature.Minimum.Value;
    const maxTemperature = forecast.Temperature.Maximum.Value;
    const dayIcon = forecast.Day.Icon;
    const nightIcon = forecast.Night.Icon;

    const dayIconClass = getWeatherIconClass(dayIcon);
    const nightIconClass = getWeatherIconClass(nightIcon);

    const resultElement = document.createElement("div");
    resultElement.classList.add("weather-result");
    resultElement.innerHTML = `
      <h2>${dayOfWeek}</h2>
      
      <p>Temperature: ${minTemperature}°F - ${maxTemperature}°F</p>
      <div>
        <span>Day: <i class="wi ${dayIconClass}"></i></span>
        <span>Night: <i class="wi ${nightIconClass}"></i></span>
      </div>
    `;

    weatherResultsContainer.appendChild(resultElement);
  });
}

function getWeatherIconClass(iconCode) {
  const iconMappings = {
    1: "wi-day-sunny",
    2: "wi-day-cloudy",
    3: "wi-cloud",
    4: "wi-cloudy",
    5: "wi-cloudy",
    6: "wi-day-rain",
    7: "wi-day-rain",
    8: "wi-day-rain",
    11: "wi-day-fog",
    12: "wi-day-showers",
    13: "wi-day-showers",
    14: "wi-day-showers",
    15: "wi-day-thunderstorm",
    16: "wi-day-snow",
    17: "wi-day-snow",
    18: "wi-day-snow",
    19: "wi-day-snow",
    20: "wi-day-fog",
    21: "wi-day-fog",
    22: "wi-day-fog",
    23: "wi-day-fog",
    24: "wi-day-windy",
    25: "wi-day-windy",
    26: "wi-day-windy",
    29: "wi-day-hail",
    30: "wi-day-hail",
    31: "wi-day-hail",
    32: "wi-day-hail",
    33: "wi-night-clear",
    34: "wi-night-alt-cloudy",
    35: "wi-cloud",
    36: "wi-cloudy",
    37: "wi-cloudy",
    38: "wi-night-alt-rain",
    39: "wi-night-alt-rain",
    40: "wi-night-alt-rain",
    41: "wi-night-fog",
    42: "wi-night-alt-showers",
    43: "wi-night-alt-showers",
    44: "wi-night-alt-showers",
    45: "wi-night-alt-thunderstorm",
    46: "wi-night-alt-snow",
    47: "wi-night-alt-snow",
    48: "wi-night-alt-snow",
    49: "wi-night-alt-snow",
    50: "wi-night-fog",
    51: "wi-night-fog",
    52: "wi-night-fog",
    53: "wi-night-fog",
    54: "wi-night-alt-cloudy-windy",
    55: "wi-night-alt-cloudy-windy",
    56: "wi-night-alt-cloudy-windy",
    59: "wi-night-alt-hail",
    60: "wi-night-alt-hail",
    61: "wi-night-alt-hail",
    62: "wi-night-alt-hail",
  };

  return iconMappings[iconCode] || "wi-na";
}

