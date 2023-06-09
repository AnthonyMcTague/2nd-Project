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
    const apiUrl = `https://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

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
  const apiLocationUrl = `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${query}`;

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
 

  const location = data.Location || data.location; 
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
    3: "wi-cloudy",
    4: "wi-cloudy-windy",
    5: "wi-day-haze",
    6: "wi-day-cloudy-windy",
    7: "wi-day-cloudy",
    8: "wi-day-cloudy",
    11: "wi-day-fog",
    12: "wi-rain",
    13: "wi-day-showers",
    14: "wi-day-showers",
    15: "wi-thunderstorm",
    16: "wi-snow",
    17: "wi-sleet",
    18: "wi-day-showers",
    19: "wi-dust",
    20: "wi-fog",
    21: "wi-day-haze",
    22: "wi-smoke",
    23: "wi-strong-wind",
    24: "wi-windy",
    25: "wi-snowflake-cold",
    26: "wi-cloudy",
    29: "wi-day-thunderstorm",
    30: "wi-night-clear",
    31: "wi-night-partly-cloudy",
    32: "wi-night-cloudy",
    33: "wi-night-cloudy",
    34: "wi-night-cloudy",
    35: "wi-night-cloudy",
    36: "wi-night-rain",
    37: "wi-night-showers",
    38: "wi-thunderstorm",
    39: "wi-night-showers",
    40: "wi-night-showers",
    41: "wi-night-snow",
    42: "wi-night-snow",
    43: "wi-night-snow",
    44: "wi-cloud"
  };

  return iconMappings[iconCode] || "wi-cloud";
}

function openTab(event, tabName) {
  const tabContents = document.getElementsByClassName("tab-content");
  for (let i = 0; i < tabContents.length; i++) {
    tabContents[i].style.display = "none";
  }

  const tabButtons = document.getElementsByClassName("tab-button");
  for (let i = 0; i < tabButtons.length; i++) {
    tabButtons[i].classList.remove("active");
  }

  const selectedTab = document.getElementById(tabName);
  selectedTab.style.display = "block";
  event.currentTarget.classList.add("active");
}